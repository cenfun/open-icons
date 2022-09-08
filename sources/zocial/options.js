const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');
const Helper = require('../../scripts/helper.js');
const SFE = require('svg-font-extractor');


const getNameMap = function(modulePath) {
    const file = path.resolve(modulePath, 'css/zocial.css');
    let content = fs.readFileSync(file, {
        encoding: 'utf-8'
    });

    content = Helper.cut(content, '.zocial.acrobat:before { content', '{ content: "\\f163"; }');

    //console.log(content);

    const nameMap = {};
    content.split(/\r|\n/g).forEach((line) => {
        const str = line.trim();
        //console.log(str);
        if (!str) {
            return;
        }
        const name = str.split(':')[0].replace(/\.zocial\./g, '');
        //console.log(name);
        const v = str.split('"')[1].split('"')[0];

        const code = v.replace('\\', '');

        const u = parseInt(code, 16);

        const x = String.fromCharCode(u);

        //console.log(u);

        nameMap[x] = name.toLowerCase();
    });

    //console.log(nameMap);

    const total = EC.yellow(Object.keys(nameMap).length);

    console.log('zocial nameMap:', total);

    return nameMap;
};

module.exports = {
    name: 'css-social-buttons',
    url: 'https://github.com/smcllns/css-social-buttons',

    moduleFilters: 'css',

    moduleInit: function(Util, modulePath) {

        const nameMap = getNameMap(modulePath);

        SFE({
            input: path.resolve(modulePath, 'css/zocial.svg'),
            output: path.resolve(modulePath, 'svg'),
            onSVGItem: function(item) {
                if (!item.d) {
                    return;
                }

                item.name = nameMap[item.unicode];

                if (!item.name) {
                    return;
                }

                return item;
            }
        });

    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
