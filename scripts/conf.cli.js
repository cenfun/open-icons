//starfall-cli config
//https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const getSource = (options) => {
    return {
        name: options.name,
        version: require(`../node_modules/${options.name}/package.json`).version,
        url: options.url,
        readme: options.readme,
        license: options.license
    };
};

const packageHandler = (item, Util, name, index, total) => {

    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'src'));
    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'dist'));
    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'public'));

    const outputName = `${item.namespace}-${name}`;
    if (fs.existsSync(path.resolve(item.buildPath, `${outputName}.js`))) {
        Util.logYellow(`exists cache and ignore: ${name}`);
        return;
    }

    console.log(`start svg minify: ${name}`);

    //Util.format(optionsPath);

    const optionsPath = path.resolve(item.sourcesRoot, name, 'options.js');
    const options = require(optionsPath);
    const source = getSource(options);

    let dirs = options.dirs;
    if (typeof dirs === 'function') {
        dirs = dirs.call(options, name, Util);
    }

    //compress svg
    const svgMinifier = require('svg-minifier');
    const config = {
        namespace: outputName,
        dirs,
        outputDir: item.outputRoot,
        outputRuntime: false,
        metadata: {
            name,
            source
        }
    };
    if (options.exclude) {
        config.exclude = options.exclude;
    }
    config.excludeSubDir = options.excludeSubDir;

    if (options.onSVGDocument) {
        config.onSVGDocument = options.onSVGDocument;
    }
    if (options.onSVGName) {
        config.onSVGName = options.onSVGName;
    }

    const metadata = svgMinifier(config);

    const compress = require('lz-utils/lib/compress.js');
    const compressedStr = compress(JSON.stringify(metadata));

    //save lz.js
    const lzPath = path.resolve(item.buildPath, `${outputName}.js`);

    const URT = require('umd-runtime-templates');
    URT({
        template: 'export-default-string',
        name: outputName,
        content: compressedStr,
        output: lzPath
    });

    Util.logCyan(`minified package: ${name} (${index}/${total})`);

};

const beforeBuildWebIcons = (item, Util) => {

    const namespace = require('../package.json').name;
    item.namespace = namespace;

    const sourcesRoot = path.resolve(__dirname, '../sources');
    item.sourcesRoot = sourcesRoot;

    const list = fs.readdirSync(sourcesRoot);

    const outputRoot = path.resolve(item.componentPath, './output');
    if (!fs.existsSync(outputRoot)) {
        fs.mkdirSync(outputRoot);
    }
    item.outputRoot = outputRoot;

    const packages = [];

    const total = list.length;
    list.forEach((name, i) => {

        packageHandler(item, Util, name, i + 1, total);

        const outputName = `${item.namespace}-${name}`;

        const p = path.resolve(item.buildPath, `${outputName}.js`);
        const size = fs.statSync(p).size;

        const gzip = zlib.gzipSync(fs.readFileSync(p), {
            level: 9
        });
        const sizeGzip = gzip.length;
        //console.log('sizeGzip', sizeGzip);

        const sizeJson = fs.statSync(path.resolve(item.outputRoot, `${outputName}.json`)).size;

        packages.push({
            name,
            namespace: outputName,
            size,
            sizeGzip,
            sizeJson
        });
    });

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

        before: (item, Util) => {

            if (item.name === 'open-icons') {
                beforeBuildWebIcons(item, Util);
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
                const outputPath = path.resolve(item.outputRoot, `${pkg.namespace}.json`);
                //console.log(outputPath);
                const json = require(outputPath);
                const source = getSource(json.source);
                const icons = json.icons.length;

                totalIcons += icons;
                totalSize += pkg.size;
                totalSizeGzip += pkg.sizeGzip;

                return {
                    index: i + 1,
                    name: pkg.name,
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
