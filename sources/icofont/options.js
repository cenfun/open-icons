const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'icofont',
    url: 'https://github.com/LuanHimmlisch/icofont',

    moduleInit: function(modulePath, Util) {

        SFE({
            input: path.resolve(modulePath, 'dist/fonts/icofont.svg'),
            output: path.resolve(modulePath, 'svg')
        });

    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
