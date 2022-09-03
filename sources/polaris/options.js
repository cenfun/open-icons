const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@shopify/polaris-icons',
    url: 'https://github.com/Shopify/polaris',
    dirs: 'dist/svg',

    onSVGName: function(name, item) {
        name = Helper.pascalToKebabCase(name);
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
