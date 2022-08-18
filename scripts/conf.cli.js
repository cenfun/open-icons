//starfall-cli config
//https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');

const iconsHandler = (item, Util, dir, i, total) => {

    // Util.rmSync(path.resolve(item.iconsRoot, dir, 'src'));
    // Util.rmSync(path.resolve(item.iconsRoot, dir, 'dist'));
    // Util.rmSync(path.resolve(item.iconsRoot, dir, 'public'));

    const optionsPath = path.resolve(item.iconsRoot, dir, 'options.js');

    //Util.format(optionsPath);

    const options = require(optionsPath);

    const outputName = `${item.namespace}-${dir}`;

    if (fs.existsSync(path.resolve(item.buildPath, `${outputName}.js`))) {
        Util.logYellow(`exists cache and ignore: ${dir}`);
        return;
    }

    console.log(`start svg minify: ${dir}`);

    let dirs = options.dirs;
    if (typeof dirs === 'function') {
        dirs = dirs.call(options, dir, Util);
    }

    let version = '';
    const packagePath = path.resolve(__dirname, `../node_modules/${options.name}/package.json`);
    const json = Util.readJSONSync(packagePath);
    if (json) {
        version = json.version;
    }

    //compress svg
    const svgMinifier = require('svg-minifier');
    const config = {
        namespace: outputName,
        dirs,
        outputDir: item.outputRoot,
        outputRuntime: false,
        metadata: {
            name: dir,
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

    Util.logCyan(`minified: ${dir} (${i}/${total})`);

};

const beforeBuildWebIcons = (item, Util) => {

    const namespace = require('../package.json').name;
    item.namespace = namespace;

    const iconsRoot = path.resolve(__dirname, '../icons');
    item.iconsRoot = iconsRoot;

    const iconsDirs = fs.readdirSync(iconsRoot);

    const outputRoot = path.resolve(item.componentPath, './output');
    if (!fs.existsSync(outputRoot)) {
        fs.mkdirSync(outputRoot);
    }
    item.outputRoot = outputRoot;

    const icons = {};

    const total = iconsDirs.length;
    iconsDirs.forEach((dir, i) => {
        iconsHandler(item, Util, dir, i, total);

        const outputName = `${item.namespace}-${dir}`;
        const size = fs.statSync(path.resolve(item.buildPath, `${outputName}.js`)).size;
        const sizeJson = fs.statSync(path.resolve(item.outputRoot, `${outputName}.json`)).size;

        icons[dir] = {
            size,
            sizeJson
        };
    });

    //generating icons.json
    const iconsPath = path.resolve(item.componentPath, 'src/icons.json');
    Util.writeJSONSync(iconsPath, icons);

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
