module.exports = {
    name: '@carbon/icons',
    url: 'https://github.com/carbon-design-system/carbon',

    moduleFilters: 'svg/32',
    dirs: 'svg/32',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },

    onSVGName: function(name, item) {
        //replace -- to -
        name = name.split(/-+/).join('-');
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    }

};
