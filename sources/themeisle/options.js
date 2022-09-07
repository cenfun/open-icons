const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'themeisle-icons',
    url: 'https://github.com/Codeinwp/themeisle-icons',

    downloadUrl: 'https://github.com/Codeinwp/themeisle-icons/archive/refs/heads/master.zip',
    moduleEntry: 'themeisle-icons-master',
    moduleFilters: 'fonts/themeisle-icons.svg',

    license: 'Apache-2.0',

    dirs: function(Util, modulePath) {

        SFE({
            input: path.resolve(modulePath, 'fonts/themeisle-icons.svg'),
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

        return 'svg';
    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
