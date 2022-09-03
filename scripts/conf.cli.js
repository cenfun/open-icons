//starfall-cli config
//https://github.com/cenfun/starfall-cli

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

    const jsonPath = path.resolve(options.modulePath, 'package.json');
    const json = require(jsonPath);

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

const getDirs = (pkg, name, Util) => {
    let dirs = pkg.dirs;
    if (typeof dirs === 'function') {
        dirs = dirs.call(pkg, name, Util);
    }

    if (!Array.isArray(dirs)) {
        dirs = [dirs];
    }
    //do NOT filter empty, some dir svg are in root ""
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

//=============================================================================================

const tarExtract = (stream, folderPath, Util) => {
    const tar = require('tar');
    return new Promise((resolve) => {
        const extractor = tar.x({
            cwd: folderPath
        }).on('error', (err) => {
            Util.logRed(err);
            resolve(1);
        }).on('end', () => {
            Util.log('[extracted]', Util.relativePath(folderPath));
            resolve(0);
        });
        stream.pipe(extractor);
    });
};

const downloadDistFile = async (url, times, Util) => {

    const axios = require('axios');

    times -= 1;
    const res = await axios({
        method: 'get',
        url: url,
        timeout: 10 * 1000,
        responseType: 'stream'
    }).catch(function(e) {
        Util.logRed(e);
    });
    if (!res || !res.data) {
        if (times > 0) {
            Util.logYellow('Failed to download dist tar file, try again ...');
            return downloadDistFile(url, times, Util);
        }
        return;
    }
    return res;
};

const downloadVersion = async (pkg, info, Util) => {
    if (!info.dist || !info.dist.tarball) {
        Util.logRed(`ERROR: Not found ${pkg.name} dist or dist.tarball`);
        return;
    }
    const url = info.dist.tarball;
    const res = await downloadDistFile(url, 2, Util);
    if (!res || !res.data) {
        Util.logRed(`ERROR: Failed to download dist tar file: ${url}`);
        return;
    }

    return res.data;

};

const requestRepoInfo = async (job, pkg, Util) => {

    const axios = require('axios');

    const url = job.npmConfig.registry + pkg.name;

    const res = await axios({
        method: 'get',
        url: url,
        timeout: 10 * 1000,
        responseType: 'json'
    }).catch(function(e) {
        Util.logRed(e);
    });

    if (!res || !res.data) {
        Util.logRed(`ERROR: Failed to get module info: ${url}`);
        return;
    }
    const info = res.data;
    if (!info.name || !info.versions) {
        Util.logRed(`ERROR: Invalid JSON data: ${url}`);
        return;
    }

    return info;
};

const downloadPkgHandler = async (job, name, pkg, Util) => {

    const sourcePath = path.resolve(Util.getTempRoot(), 'sources', name);
    pkg.sourcePath = Util.relativePath(sourcePath);
    const modulePath = path.resolve(sourcePath, 'package');
    pkg.modulePath = Util.relativePath(modulePath);

    //check pkg if downloaded
    const pkgJsonPath = path.resolve(pkg.modulePath, 'package.json');
    if (fs.existsSync(pkgJsonPath)) {
        return;
    }

    //console.log(pkgJsonPath);

    let repoInfo = await requestRepoInfo(job, pkg, Util);
    if (!repoInfo) {
        console.log('Try download again ...');
        repoInfo = await requestRepoInfo(job, pkg, Util);
    }
    if (!repoInfo) {
        throw new Error(`Failed to download repo config: ${pkg.name}`);
    }

    const repoPath = path.resolve(pkg.sourcePath, 'repository.json');
    Util.writeJSONSync(repoPath, repoInfo);
    Util.logGreen(`saved repository json: ${Util.relativePath(repoPath)}`);

    const latestVersion = repoInfo['dist-tags'].latest;
    const versionInfo = repoInfo.versions[latestVersion];

    const dist = await downloadVersion(pkg, versionInfo, Util);
    if (!dist) {
        throw new Error(`Failed to download dist: ${pkg.name}`);
    }

    const distPath = path.resolve(pkg.sourcePath, 'package.tgz');
    dist.pipe(fs.createWriteStream(distPath));

    Util.log('[downloaded]', Util.relativePath(distPath));

    const code = await tarExtract(dist, pkg.sourcePath, Util);
    if (code) {
        throw new Error(`Failed to extract dist: ${pkg.name}`);
    }

};

const pkgHandler = async (job, name, index, total, Util) => {

    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'src'));
    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'dist'));
    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'public'));
    const optionsPath = path.resolve(job.sourcesRoot, name, 'options.js');
    const pkg = require(optionsPath);

    if (pkg.disabled) {
        Util.logRed(`disabled: ${name}`);
        return false;
    }

    const outputName = `${job.id}-${name}`;
    if (fs.existsSync(path.resolve(job.buildPath, `${outputName}.js`))) {

        if (!pkg.debug) {
            Util.logYellow(`exists cache and ignored: ${name}`);
            return true;
        }

        Util.logMagenta(`debug mode and cache ignored: ${name}`);

    }

    await downloadPkgHandler(job, name, pkg, Util);

    console.log(`start svg minify: ${name}`);

    //Util.format(optionsPath);

    const source = getSource(pkg);
    //console.log(source.name, source.license);

    const dirs = getDirs(pkg, name, Util);

    //compress svg
    const svgMinifier = require('svg-minifier');
    const config = {
        id: outputName,
        dirs,
        outputDir: job.outputRoot,
        outputRuntime: false,
        metadata: {
            name,
            source
        }
    };
    if (pkg.exclude) {
        config.exclude = pkg.exclude;
    }
    config.excludeSubDir = pkg.excludeSubDir;

    //events handler
    ['onSVGName', 'onSVGContent', 'onSVGDocument', 'onSVGOptimized', 'onSVGError'].forEach((type) => {
        const handler = pkg[type];
        if (typeof handler === 'function') {
            config[type] = handler;
        }
    });

    const metadata = svgMinifier(config);

    if (!metadata.icons.length) {
        throw new Error(`Failed to generate icons: ${metadata.name}`);
    }

    const compress = require('lz-utils/lib/compress.js');
    const compressedStr = compress(JSON.stringify(metadata));

    //save lz.js
    const lzPath = path.resolve(job.buildPath, `${outputName}.js`);

    const URT = require('umd-runtime-templates');
    URT({
        template: 'export-default-string',
        name: outputName,
        content: compressedStr,
        output: lzPath
    });

    Util.logCyan(`minified package: ${name} (${index}/${total})`);

    return true;
};

const beforeBuildHandler = async (item, Util) => {

    const id = require('../package.json').name;
    item.id = id;

    const sourcesRoot = path.resolve(__dirname, '../sources');
    item.sourcesRoot = sourcesRoot;

    const list = fs.readdirSync(sourcesRoot);

    const outputRoot = path.resolve(item.componentPath, './output');
    if (!fs.existsSync(outputRoot)) {
        fs.mkdirSync(outputRoot);
    }
    item.outputRoot = outputRoot;

    const rc = require('rc');
    const npmConfig = rc('npm', {
        registry: 'https://registry.npmjs.org/'
    });
    // console.log(npmConfig);
    item.npmConfig = npmConfig;

    const packages = [];

    let i = 1;
    const total = list.length;

    for (const name of list) {

        const enabled = await pkgHandler(item, name, i++, total, Util);
        if (!enabled) {
            continue;
        }

        const outputName = `${item.id}-${name}`;

        const p = path.resolve(item.buildPath, `${outputName}.js`);
        const size = fs.statSync(p).size;

        const gzip = zlib.gzipSync(fs.readFileSync(p), {
            level: 9
        });
        const sizeGzip = gzip.length;
        //console.log('sizeGzip', sizeGzip);

        const sizeJson = fs.statSync(path.resolve(item.outputRoot, `${outputName}.json`)).size;

        packages.push({
            id: outputName,
            name,
            size,
            sizeGzip,
            sizeJson
        });
    }

    item.packages = packages;

    //console.log(packages);

    //generating packages.json
    const packagesPath = path.resolve(item.componentPath, 'src/packages.json');
    Util.writeJSONSync(packagesPath, packages);

};

module.exports = {

    build: {

        vendors: ['app', 'open-icons'],

        define: (env) => {

            let dest = '../../../node_modules/open-icons/dist/';
            if (env.production) {
                dest = 'dist/';
            }

            return {
                'window.WC_ICONS_PATH': JSON.stringify(dest),
                __VUE_OPTIONS_API__: false,
                __VUE_PROD_DEVTOOLS__: false
            };
        },

        webpackConfig: (conf, Util) => {
            conf.devtool = false;
            return conf;
        },

        before: async (item, Util) => {

            if (item.name === 'open-icons') {
                await beforeBuildHandler(item, Util);
            }

            return 0;
        },

        afterAll: (o, Util) => {
            const item = o.jobList.find((it) => it.name === 'open-icons');
            if (!item) {
                return 0;
            }

            if (!item.production) {
                return 0;
            }

            //screenshots handler

            let totalIcons = 0;
            let totalSize = 0;
            let totalSizeGzip = 0;

            const list = item.packages.map((pkg, i) => {
                const outputPath = path.resolve(item.outputRoot, `${pkg.id}.json`);
                //console.log(outputPath);
                const json = require(outputPath);
                const source = json.source;
                const icons = json.icons.length;

                totalIcons += icons;
                totalSize += pkg.size;
                totalSizeGzip += pkg.sizeGzip;

                return {
                    index: i + 1,
                    name: `[${pkg.name}](https://cenfun.github.io/open-icons/#${pkg.name})`,
                    icons: icons.toLocaleString(),
                    size: Util.BF(pkg.size),
                    sizeGzip: Util.BF(pkg.sizeGzip),
                    source: `[${source.name}@${source.version}](${source.url})`,
                    license: source.license
                };
            });

            list.push({
                index: '',
                name: 'Total',
                icons: totalIcons.toLocaleString(),
                size: Util.BF(totalSize),
                sizeGzip: Util.BF(totalSizeGzip),
                source: '',
                license: ''
            });

            //console.log(list);

            const MG = require('markdown-grid');
            const mg = MG({
                columns: [{
                    id: 'index',
                    name: '',
                    align: 'right'
                }, {
                    id: 'name',
                    name: 'Name',
                    align: 'left'
                }, {
                    id: 'icons',
                    name: 'Icons',
                    align: 'right'
                }, {
                    id: 'size',
                    name: 'Size',
                    align: 'right'
                }, {
                    id: 'sizeGzip',
                    name: 'Gzip',
                    align: 'right'
                }, {
                    id: 'source',
                    name: 'Source'
                }, {
                    id: 'license',
                    name: 'License'
                }],
                rows: list
            });

            const from = path.resolve(__dirname, 'template/README.md');
            const dest = path.resolve(__dirname, '../README.md');

            Util.editFile(from, (content) => {
                return Util.replace(content, {
                    placeholder_list: mg
                });
            }, dest);

            fs.copyFileSync(dest, path.resolve(__dirname, '../packages/open-icons/README.md'));

            return 0;
        }

    },

    pack: {

        after: (item, Util) => {
            console.log('copy icons dist ...');

            const from = path.resolve(__dirname, '../packages/open-icons/dist');
            const list = fs.readdirSync(from);

            const dest = path.resolve(item.distPath);

            list.forEach((name) => {
                const to = path.resolve(dest, name);
                fs.copyFileSync(path.resolve(from, name), to);
                console.log(`copied: ${Util.relativePath(to)}`);
            });

            return 0;
        }
    }
};
