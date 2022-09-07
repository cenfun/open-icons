const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@h2d2/shopicons',
    url: 'https://github.com/H2D2-Design/h2d2-shopicons',

    moduleFilters: 'SVG',

    dirs: ['SVG/Filled', {
        outline: 'SVG/Regular'
    }, {
        light: 'SVG/Light'
    }],

    onSVGName: function(name, item) {

        name = name.replace(/Shopicons_Filled_/g, '');
        name = name.replace(/Shopicons_Regular_/g, '');
        name = name.replace(/Shopicons_Light_/g, '');

        name = name.replace(/_/g, '-');

        name = Helper.pascalToKebabCase(name);

        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
