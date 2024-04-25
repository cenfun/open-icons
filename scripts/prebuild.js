const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const getLicense = (json) => {

    if (json.license) {
        return json.license;
    }

    if (json.licenses) {
        return json.licenses.type;
    }

    return 'MIT';
};

const getSource = (options) => {

    let json = {
        license: '',
        version: ''
    };

    const jsonPath = path.resolve(options.modulePath, 'package.json');
    if (fs.existsSync(jsonPath)) {
        json = require(jsonPath);
    }

    let license = options.license;
    if (!license) {
        license = getLicense(json);
    }

    return {
        name: options.name,
        url: options.url,
        version: json.version,
        license: license
    };
};

const getDirs = (pkg) => {
    let dirs = pkg.dirs;
    // maybe empty "" for root path
    if (typeof dirs === 'undefined') {
        dirs = ['svg'];
    }

    if (!Array.isArray(dirs)) {
        dirs = [dirs];
    }
    // do NOT filter empty, some dir svg are in root ""
    return dirs.map((item) => {
        if (typeof item === 'object') {
            for (const type in item) {
                const p = item[type];
                if (!fs.existsSync(p)) {
                    item[type] = path.resolve(pkg.modulePath, p);
                }
            }
            return item;
        }
        if (!fs.existsSync(item)) {
            item = path.resolve(pkg.modulePath, item);
        }
        return item;
    });
};

// =============================================================================================

const getModulePath = (pkg, name, Util) => {
    const isNpm = !pkg.downloadUrl;
    if (isNpm) {
        return path.resolve(Util.getTempRoot(), 'install-from-npm/node_modules', pkg.name);
    }

    const moduleEntry = pkg.moduleEntry || '';
    return path.resolve(Util.getTempRoot(), 'download-from-url', name, moduleEntry);
};

const pkgInit = (options, Util) => {
    const {
        pkg, name, index, total,
        relPath, jsPath,
        outputName, outputRoot
    } = options;

    const modulePath = getModulePath(pkg, name, Util);
    if (!fs.existsSync(modulePath)) {
        Util.logRed(`Invalid module path: ${modulePath}`);
        Util.logRed('try "npm run download" first');
        return false;
    }

    // for get dirs
    pkg.modulePath = modulePath;
    Util.createSvgDir = (dirName) => {
        const svgDir = path.resolve(modulePath, dirName || 'svg');
        if (!fs.existsSync(svgDir)) {
            fs.mkdirSync(svgDir);
        }
        return svgDir;
    };

    if (typeof pkg.moduleInit === 'function') {
        Util.log('module init ...');
        try {
            pkg.moduleInit.call(pkg, modulePath, Util);
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    const dirs = getDirs(pkg);
    const source = getSource(pkg);
    // console.log(source.name, source.license);

    Util.log(`${index}, start svg minify: ${name}`);

    // compress svg
    const svgMinifier = require('svg-minifier');
    const config = {
        id: outputName,
        dirs,
        outputDir: outputRoot,
        outputRuntime: false,

        logDuplicates: pkg.debug,

        metadata: {
            name,
            source
        }
    };
    if (pkg.exclude) {
        config.exclude = pkg.exclude;
    }
    config.excludeSubDir = pkg.excludeSubDir;

    // events handler
    ['onSVGName', 'onSVGContent', 'onSVGDocument', 'onSVGOptimized', 'onSVGError', 'onFinish'].forEach((type) => {
        const handler = pkg[type];
        if (typeof handler === 'function') {
            config[type] = handler;
        }
    });

    const metadata = svgMinifier(config);

    if (!metadata.icons.length) {
        Util.logRed(`Failed to generate icons: ${metadata.name}`);
        return false;
    }

    const compress = require('lz-utils/deflate-sync');
    const compressedStr = compress(JSON.stringify(metadata));

    const URT = require('umd-runtime-templates');
    URT({
        name: outputName,
        template: 'export-default-string',
        content: compressedStr,
        output: jsPath
    });

    Util.logCyan(`minified package: ${name} ${relPath} (${index}/${total})`);

    return true;
};

const pkgHandler = (options, Util) => {

    const {
        sourcesRoot, jsPath, name, index
    } = options;

    const optionsPath = path.resolve(sourcesRoot, name, 'options.js');
    const pkg = require(optionsPath);
    options.pkg = pkg;

    if (fs.existsSync(jsPath)) {

        if (!pkg.debug) {
            Util.logYellow(`${index}, exists build cache: ${name}`);
            return true;
        }

        Util.logMagenta(`[debug mode] start minify: ${name}`);

    }

    return pkgInit(options, Util);
};

const prebuild = (job, Util) => {

    const sourcesRoot = path.resolve(__dirname, '../sources');
    const list = fs.readdirSync(sourcesRoot);

    // dist path
    if (!fs.existsSync(job.buildPath)) {
        fs.mkdirSync(job.buildPath);
    }
    // output path
    const outputRoot = path.resolve(job.componentPath, './output');
    if (!fs.existsSync(outputRoot)) {
        fs.mkdirSync(outputRoot);
    }

    // for afterAll
    job.outputRoot = outputRoot;

    const rc = require('rc');
    const npmConfig = rc('npm', {
        registry: 'https://registry.npmjs.org/'
    });

    const id = require('../package.json').name;
    const options = {
        sourcesRoot,
        outputRoot,
        npmConfig,
        id
    };

    const packages = [];

    let i = 1;
    const total = list.length;

    for (const name of list) {

        const outputName = `${id}-${name}`;

        // js path
        const jsPath = path.resolve(job.buildPath, `${outputName}.js`);
        const relPath = Util.relativePath(jsPath);
        // add to dependencies then do not be removed after build
        if (!job.dependencies.files.includes(relPath)) {
            job.dependencies.files.push(relPath);
        }

        const pkgOptions = {
            ... options,
            name,
            outputName,
            index: i++,
            total,
            jsPath,
            relPath
        };

        const ok = pkgHandler(pkgOptions, Util);
        if (!ok) {
            return 1;
        }

        const p = path.resolve(job.buildPath, `${outputName}.js`);
        const size = fs.statSync(p).size;

        const gzip = zlib.gzipSync(fs.readFileSync(p), {
            level: 9
        });
        const sizeGzip = gzip.length;
        // console.log('sizeGzip', sizeGzip);

        const jsonPath = path.resolve(outputRoot, `${outputName}.json`);
        // do not use icons, will be merged with {icons}
        const count = JSON.parse(fs.readFileSync(jsonPath).toString('utf-8')).icons.length;
        const sizeJson = fs.statSync(jsonPath).size;

        packages.push({
            id: outputName,
            name,
            count,
            size,
            sizeGzip,
            sizeJson
        });
    }

    // for afterAll
    job.packages = packages;

    // console.log(packages);

    // generating packages.json
    const packagesPath = path.resolve(job.componentPath, 'src/packages.json');

    const content = fs.readFileSync(packagesPath).toString('utf-8');
    const newContent = JSON.stringify(packages, null, 4);
    if (newContent !== content) {
        fs.writeFileSync(packagesPath, newContent);
    }
    return 0;
};


module.exports = prebuild;
