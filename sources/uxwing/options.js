const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'uxwing-iconsfont',
    url: 'https://github.com/UXWing/vector-icons',

    downloadUrl: 'https://github.com/UXWing/vector-icons/archive/refs/heads/master.zip',
    moduleEntry: 'vector-icons-master',
    moduleFilters: 'fonts/uxwing-iconsfont.svg',

    license: 'MIT and Open Font',

    dirs: function(Util, modulePath) {

        SFE({
            input: path.resolve(modulePath, 'fonts/uxwing-iconsfont.svg'),
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
