//starfall-cli config
//https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');
const os = require('os');

const iconsHandler = (item, Util, dir, i, total) => {

    // Util.rmSync(path.resolve(item.iconsRoot, dir, 'src'));
    // Util.rmSync(path.resolve(item.iconsRoot, dir, 'dist'));
    // Util.rmSync(path.resolve(item.iconsRoot, dir, 'public'));

    const optionsPath = path.resolve(item.iconsRoot, dir, 'options.js');
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

    //compress svg
    const svgMinifier = require('svg-minifier');
    const config = {
        namespace: outputName,
        dirs,
        outputDir: item.outputRoot,
        outputRuntime: false,
        metadata: {
            name: dir,
            package: options.package,
            url: options.url,
            readme: options.readme,
            license: options.license
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

            //if (!Util.option.production) {
            return 0;
            //}

            //console.log(option);

            // const env = option.jobList[0].env;
            // const componentsRoot = option.workerOption.componentsRoot;

            // //console.log(buildENV, componentsRoot);

            // const buildPath = Util.getConfig('build.path');

            // const dirs = fs.readdirSync(componentsRoot);

            // const list = dirs.map((dir) => {
            //     const metadata = Util.readJSONSync(path.resolve(componentsRoot, dir, buildPath, 'metadata.json'));
            //     return {
            //         name: dir,
            //         ... metadata
            //     };
            // });

            // //console.log(list);

            // //================================================================================
            // console.log('generating README.md ....');
            // //README.md
            // let total = 0;
            // const readmeList = list.map((item, i) => {
            //     total += item.total;
            //     return [
            //         i + 1,
            //         `[${item.name}](packages/${item.name})`,
            //         item.total.toLocaleString(),
            //         item.size,
            //         item.gzip,
            //         item.license,
            //         `[${item.package}@${item.version}](${item.url})`
            //     ];
            // });
            // readmeList.push(['', 'Total', total.toLocaleString(), '', '', '', '']);

            // const readmeTable = getMarkDownTable({
            //     columns: [{
            //         name: '',
            //         width: 2,
            //         align: 'right'
            //     }, {
            //         name: 'Name',
            //         width: 32
            //     }, {
            //         name: 'Icons',
            //         width: 5,
            //         align: 'right'
            //     }, {
            //         name: 'Size',
            //         width: 8,
            //         align: 'right'
            //     }, {
            //         name: 'Gzip',
            //         width: 8,
            //         align: 'right'
            //     }, {
            //         name: 'License',
            //         width: 7
            //     }, {
            //         name: 'Built from',
            //         width: 10
            //     }],
            //     rows: readmeList
            // });
            // let readmeContent = Util.readFileContentSync(path.resolve(__dirname, 'template/README.md'));
            // readmeContent = readmeContent.replace('{replace_holder_list}', readmeTable);
            // const readmePath = path.resolve(__dirname, '../README.md');
            // Util.writeFileContentSync(readmePath, readmeContent);
            // console.log('generated README.md');

            // //================================================================================
            // console.log('generating docs ....');

            // const jsPath = path.resolve(__dirname, '../docs/js');
            // //clean previous
            // Util.rmSync(jsPath);
            // fs.mkdirSync(jsPath, {
            //     recursive: true
            // });

            // //copy vendors
            // const vendors = {
            //     'turbogrid.js': '../node_modules/turbogrid/dist/turbogrid.js',
            //     'filesaver.js': '../node_modules/file-saver/dist/FileSaver.min.js',
            //     'open-store.js': '../node_modules/open-store/dist/open-store.js'
            // };

            // Object.keys(vendors).forEach((key) => {
            //     fs.copyFileSync(path.resolve(__dirname, vendors[key]), path.resolve(jsPath, key));
            //     console.log(`copied ${key}`);
            // });


            // const libs = [];
            // //copy packages
            // list.forEach((p) => {
            //     const fn = `wci-${p.name}.js`;
            //     fs.copyFileSync(path.resolve(__dirname, `../packages/${p.name}/dist/${fn}`), path.resolve(jsPath, fn));
            //     libs.push(fn);
            //     console.log(`copied ${fn}`);
            // });

            // //metadata.js
            // console.log('generating metadata ....');
            // const metadataPath = path.resolve(jsPath, 'metadata.js');
            // const metadata = {
            //     ... env,
            //     libs,
            //     list
            // };

            // const metadataContent = `window.wciMetadata = ${JSON.stringify(metadata, null, 4)};`;
            // Util.writeFileContentSync(metadataPath, metadataContent);

            // console.log('generated docs');

            // return 0;
        }

    }
};
