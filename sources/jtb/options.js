const path = require('path');
const SFE = require('svg-font-extractor');
module.exports = {
    name: 'jtb-icons',
    url: 'https://github.com/JTBLabs/JTB-Icons',

    downloadUrl: 'https://github.com/JTBLabs/JTB-Icons/archive/refs/heads/main.zip',
    moduleEntry: 'JTB-Icons-main',

    license: 'MIT',

    moduleInit: function(modulePath, Util) {

        SFE({
            input: path.resolve(modulePath, 'fonts/jtbIR.svg'),
            output: path.resolve(modulePath, 'svg'),
            onSVGItem: function(item) {
                const name = item['glyph-name'];
                if (!name || !item.d) {
                    return;
                }
                return item;
            }
        });

        SFE({
            input: path.resolve(modulePath, 'fonts/jtbIB.svg'),
            output: path.resolve(modulePath, 'svg'),
            onSVGItem: function(item) {
                const name = item['glyph-name'];
                if (!name || !item.d) {
                    return;
                }
                return item;
            }
        });

    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    },

    readme: 'Without light icons'

};
