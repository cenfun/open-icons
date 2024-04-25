const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: '@blueprintjs/icons',
    url: 'https://github.com/palantir/blueprint',

    moduleInit: function(modulePath, Util) {

        SFE({
            input: path.resolve(modulePath, 'lib/css/blueprint-icons-20.svg'),
            output: path.resolve(modulePath, 'svg')
        });

    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
