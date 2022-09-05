const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'elementor-icons',
    url: 'https://github.com/elementor/elementor-icons',
    downloadUrl: 'https://github.com/elementor/elementor-icons/archive/refs/heads/master.zip',
    moduleEntry: 'elementor-icons-master',

    dirs: function(Util, modulePath) {

        SFE({
            input: path.resolve(modulePath, 'fonts/eicons.svg'),
            output: path.resolve(modulePath, 'svg')
        });

        return 'svg';
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
