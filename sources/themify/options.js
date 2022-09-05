const fs = require('fs');
const path = require('path');
const EC = require('eight-colors');
const SFE = require('svg-font-extractor');

const getNameMap = function(modulePath) {
    const file = path.resolve(modulePath, 'themify-icons/_icons.scss');
    const content = fs.readFileSync(file, {
        encoding: 'utf-8'
    });

    const nameMap = {};
    content.split(/\r|\n/g).forEach((line) => {
        const str = line.trim();
        //console.log(str);
        if (!str) {
            return;
        }
        const name = str.split(':')[0].replace(/\.icon-/g, '');
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

    console.log('themify-icons nameMap:', total);

    return nameMap;
};

module.exports = {
    debug: true,
    name: 'themify-icons',
    url: 'https://github.com/aastrong/themify-icons.scss',
    dirs: function(Util) {
        const modulePath = this.modulePath;
        const nameMap = getNameMap(modulePath);

        SFE({
            input: path.resolve(modulePath, 'themify-icons/fonts/themify.svg'),
            output: path.resolve(modulePath, 'svg'),
            onSVGItem: function(item) {
                //filter no d item
                if (!item.d) {
                    return;
                }

                item.name = nameMap[item.unicode] || item.index;

                return item;
            }
        });

        return 'svg';
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
