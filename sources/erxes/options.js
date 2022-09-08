const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'erxes-icon',
    url: 'https://github.com/erxes/erxes-icon',

    downloadUrl: 'https://github.com/erxes/erxes-icon/archive/refs/heads/master.zip',
    moduleEntry: 'erxes-icon-master',

    moduleFilters: 'font/erxes.svg',

    license: 'MIT',

    moduleInit: function(Util, modulePath) {

        SFE({
            input: path.resolve(modulePath, 'font/erxes.svg'),
            output: path.resolve(modulePath, 'svg'),
            onSVGItem: function(item) {

                const name = item['glyph-name'];
                if (!name || !item.d) {
                    return;
                }

                item.name = name.replace(/_/g, '-');

                return item;
            }
        });

    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
