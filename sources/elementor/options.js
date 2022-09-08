const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'elementor-icons',
    url: 'https://github.com/elementor/elementor-icons',

    downloadUrl: 'https://github.com/elementor/elementor-icons/archive/refs/heads/master.zip',
    moduleEntry: 'elementor-icons-master',
    moduleFilters: 'fonts/eicons.svg',

    moduleInit: function(Util, modulePath) {

        SFE({
            input: path.resolve(modulePath, 'fonts/eicons.svg'),
            output: path.resolve(modulePath, 'svg')
        });

    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
