const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'icofont',
    url: 'https://github.com/LuanHimmlisch/icofont',
    dirs: function(Util, modulePath) {

        SFE({
            input: path.resolve(modulePath, 'dist/fonts/icofont.svg'),
            output: path.resolve(modulePath, 'svg')
        });

        return 'svg';
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
