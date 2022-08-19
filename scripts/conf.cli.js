//starfall-cli config
//https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');

const packageHandler = (item, Util, name, index, total) => {

    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'src'));
    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'dist'));
    // Util.rmSync(path.resolve(item.sourcesRoot, dir, 'public'));

    const optionsPath = path.resolve(item.sourcesRoot, name, 'options.js');

    const options = require(optionsPath);

    const outputName = `${item.namespace}-${name}`;

    if (fs.existsSync(path.resolve(item.buildPath, `${outputName}.js`))) {
        Util.logYellow(`exists cache and ignore: ${name}`);
        return;
    }

    console.log(`start svg minify: ${name}`);

    Util.format(optionsPath);

    let dirs = options.dirs;
    if (typeof dirs === 'function') {
        dirs = dirs.call(options, name, Util);
    }

    const version = require(`../node_modules/${options.name}/package.json`).version;

    //compress svg
    const svgMinifier = require('svg-minifier');
    const config = {
        namespace: outputName,
        dirs,
        outputDir: item.outputRoot,
        outputRuntime: false,
        metadata: {
            name: name,
            source: {
                name: options.name,
                version: version,
                url: options.url,
                readme: options.readme,
                license: options.license
            }
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

    const content = `window['${outputName}'] = '${compressedStr}';`;

    Util.writeFileContentSync(lzPath, content);

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

    const total = packages.length;
    list.forEach((name, i) => {

        packageHandler(item, Util, name, i + 1, total);

        const outputName = `${item.namespace}-${name}`;
        const size = fs.statSync(path.resolve(item.buildPath, `${outputName}.js`)).size;
        const sizeJson = fs.statSync(path.resolve(item.outputRoot, `${outputName}.json`)).size;

        packages.push({
            name,
            namespace: outputName,
            size,
            sizeJson
        });
    });

    //generating packages.json
    const packagesPath = path.resolve(item.componentPath, 'src/packages.json');
    Util.writeJSONSync(packagesPath, packages);

};

module.exports = {

    build: {

        vendors: ['web-icons'],

        webpackConfig: (conf, Util) => {
            conf.devtool = false;
            return conf;
        },

        before: (item, Util) => {

            if (item.name === 'web-icons') {
                beforeBuildWebIcons(item, Util);
            }

            return 0;
        },

        afterAll: (option, Util) => {

            return 0;
        }

    }
};
