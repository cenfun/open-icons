// starfall-cli config
// https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const https = require('https');

let gauge;

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

const decompressPackage = async (filePath, pkg, Util) => {
    const decompress = require('decompress');

    Util.log(`package decompressing: ${Util.relativePath(filePath)} ...`);

    const options = {};

    let moduleFilters = pkg.moduleFilters;
    if (moduleFilters) {
        if (!Array.isArray(moduleFilters)) {
            moduleFilters = [moduleFilters];
        }
        moduleFilters.push('package.json');
        moduleFilters = moduleFilters.map((item) => {
            return `${pkg.moduleEntry}/${item}`;
        });

        options.filter = (file) => {
            for (const f of moduleFilters) {
                if (file.path.startsWith(f)) {
                    return true;
                }
            }
            return false;
        };
    }


    let hasError;
    const files = await decompress(filePath, pkg.sourcePath, options).catch(function(err) {
        Util.logRed(err);
        hasError = true;
    });

    if (hasError) {
        return;
    }

    Util.log(`package decompressed: ${Util.relativePath(filePath)} (${files.length} files)`);

    if (typeof pkg.moduleInit === 'function') {
        Util.log('module init ...');
        pkg.moduleInit.call(pkg, Util, pkg.modulePath);
    }

    return true;
};

const request = async (options) => {
    const axios = require('axios');
    let err;
    const res = await axios(options).catch((e) => {
        err = e;
    });
    return [err, res];
};

const downloadFile = async (url, pkg, Util, retry = 0) => {

    Util.log(`start download: ${url}`);

    const [err, res] = await request({
        method: 'get',
        url: url,
        timeout: 15 * 1000,
        responseType: 'stream',
        // onDownloadProgress: (d) => {
        //     const {
        //         loaded,
        //         total,
        //         // progress, bytes,
        //         estimated
        //         // rate, download = true
        //     } = d;
        //     console.log(loaded / total, estimated);
        // },
        httpsAgent: new https.Agent({
            // keepAlive: true,
            rejectUnauthorized: false
        })
    });

    if (err) {
        Util.logRed(err);

        if (retry < 5) {
            Util.logYellow(`retry download: ${url}`);
            return downloadFile(url, pkg, Util, retry + 1);
        }

        Util.logRed(`failed to download: ${url}`);
        Util.logRed('process exit');
        process.exit(1);

    }

    const { data, headers } = res;

    if (!data) {
        Util.logRed(`invalid response data: ${url}`);
        return;
    }

    let totalLength;
    let length = 0;

    if (!gauge) {
        const Gauge = require('gauge');
        gauge = new Gauge();
    }

    const filePath = path.resolve(pkg.sourcePath, pkg.saveName);

    const writer = fs.createWriteStream(filePath);

    data.on('data', (chunk) => {
        length += chunk.length;
        if (!totalLength) {
            totalLength = headers['content-length'];
        }
        if (totalLength) {
            const per = length / totalLength;
            const text = `${(per * 100).toFixed(2)}% downloading ${url} ...`;
            // console.log(text);
            gauge.enable();
            gauge.show(text, per);

        }
    });
    data.pipe(writer);

    return new Promise((resolve) => {
        writer.on('finish', () => {
            gauge.disable();
            Util.log(`downloaded: ${Util.relativePath(filePath)}`);

            decompressPackage(filePath, pkg, Util).then(function(done) {
                resolve(done);
            });

        });
        writer.on('error', (e) => {
            Util.logRed(e);
            resolve();
        });
    });

};

const requestRepoInfo = async (pkg, Util) => {

    const axios = require('axios');

    const url = pkg.registryUrl;

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

const downloadFromNpm = async (pkg, Util) => {
    let repoInfo = await requestRepoInfo(pkg, Util);
    if (!repoInfo) {
        console.log('Try download again ...');
        repoInfo = await requestRepoInfo(pkg, Util);
    }
    if (!repoInfo) {
        Util.logRed(`Failed to download repo config: ${pkg.name}`);
        return;
    }

    if (pkg.debug) {
        const repoPath = path.resolve(pkg.sourcePath, 'repository.json');
        Util.writeJSONSync(repoPath, repoInfo);
        Util.logGreen(`saved repository json: ${Util.relativePath(repoPath)}`);
    }

    const latestVersion = repoInfo['dist-tags'].latest;
    const versionInfo = repoInfo.versions[latestVersion];
    const url = versionInfo.dist.tarball;

    pkg.saveName = 'package.tgz';
    return downloadFile(url, pkg, Util);
};

const downloadFromUrl = (pkg, Util) => {

    const url = pkg.downloadUrl;

    pkg.saveName = 'package.zip';
    return downloadFile(url, pkg, Util);
};

const downloadHandler = (job, name, pkg, Util) => {

    // check pkg if downloaded
    if (fs.existsSync(path.resolve(pkg.modulePath))) {

        if (!pkg.debug) {
            Util.logYellow(`exists module cache: ${name}`);
            return true;
        }

        Util.logMagenta(`[debug mode] start download: ${name}`);

    }

    // console.log(pkgJsonPath);

    Util.rmSync(pkg.sourcePath);
    fs.mkdirSync(pkg.sourcePath, {
        recursive: true
    });


    if (pkg.downloadUrl) {
        return downloadFromUrl(pkg, Util);
    }

    // from npm
    pkg.registryUrl = job.npmConfig.registry + pkg.name;
    return downloadFromNpm(pkg, Util);

};

const pkgHandler = async (job, name, index, total, Util) => {

    const optionsPath = path.resolve(job.sourcesRoot, name, 'options.js');
    const pkg = require(optionsPath);

    const outputName = `${job.id}-${name}`;

    // js path
    const jsPath = path.resolve(job.buildPath, `${outputName}.js`);
    const relPath = Util.relativePath(jsPath);
    // add to dependencies then do not be removed after build
    if (!job.dependencies.files.includes(relPath)) {
        job.dependencies.files.push(relPath);
    }

    if (fs.existsSync(jsPath)) {

        if (!pkg.debug) {
            Util.logYellow(`${index}, exists build cache: ${name}`);
            return true;
        }

        Util.logMagenta(`[debug mode] start minify: ${name}`);

    }

    pkg.sourcePath = path.resolve(Util.getTempRoot(), 'sources', name);

    pkg.moduleEntry = pkg.moduleEntry || 'package';
    pkg.modulePath = path.resolve(pkg.sourcePath, pkg.moduleEntry);

    const done = await downloadHandler(job, name, pkg, Util);
    if (!done) {
        Util.logRed(`Failed to download package: ${pkg.name}`);
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
        outputDir: job.outputRoot,
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
        return;
    }

    const compress = require('lz-utils/lib/compress.js');
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

        const ok = await pkgHandler(item, name, i++, total, Util);
        if (!ok) {
            return 1;
        }

        const outputName = `${item.id}-${name}`;

        const p = path.resolve(item.buildPath, `${outputName}.js`);
        const size = fs.statSync(p).size;

        const gzip = zlib.gzipSync(fs.readFileSync(p), {
            level: 9
        });
        const sizeGzip = gzip.length;
        // console.log('sizeGzip', sizeGzip);

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

    // console.log(packages);

    // generating packages.json
    const packagesPath = path.resolve(item.componentPath, 'src/packages.json');
    Util.writeJSONSync(packagesPath, packages);

    return 0;
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

        before: (item, Util) => {

            if (item.name === 'open-icons') {
                return beforeBuildHandler(item, Util);
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

            // screenshots handler

            let totalIcons = 0;
            let totalSize = 0;
            let totalSizeGzip = 0;

            const list = item.packages.map((pkg, i) => {
                const outputPath = path.resolve(item.outputRoot, `${pkg.id}.json`);
                // console.log(outputPath);
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
                    source: `[${source.name}](${source.url})`,
                    version: source.version,
                    license: source.license
                };
            });

            const totalInfo = `${list.length} Packages & ${totalIcons.toLocaleString()} Icons`;

            list.push({
                index: '',
                name: 'Total',
                icons: totalIcons.toLocaleString(),
                size: Util.BF(totalSize),
                sizeGzip: Util.BF(totalSizeGzip),
                source: '',
                version: '',
                license: ''
            });

            // console.log(list);

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
                    name: 'Source',
                    align: 'left'
                }, {
                    id: 'version',
                    name: 'Version',
                    align: 'left'
                }, {
                    id: 'license',
                    name: 'License',
                    align: 'left'
                }],
                rows: list
            });

            const from = path.resolve(__dirname, 'template/README.md');
            const dest = path.resolve(__dirname, '../README.md');

            Util.editFile(from, (content) => {
                return Util.replace(content, {
                    placeholder_info: totalInfo,
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
