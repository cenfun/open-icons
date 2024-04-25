// starfall-cli config
// https://github.com/cenfun/starfall-cli

const fs = require('fs');
const path = require('path');

module.exports = {

    build: {

        vendors: ['app', 'open-icons'],

        define: (env) => {

            let dest = '../../../node_modules/open-icons/dist/';
            if (env.production) {
                dest = 'dist/';
            }

            return {
                'window.WC_ICONS_PATH': dest,
                __VUE_OPTIONS_API__: false,
                __VUE_PROD_DEVTOOLS__: false
            };
        },

        // webpackConfig: (conf, Util) => {
        //     conf.devtool = false;
        //     return conf;
        // },

        before: (item, Util) => {

            if (item.name === 'open-icons') {
                const beforeBuildHandler = require('./prebuild.js');
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
