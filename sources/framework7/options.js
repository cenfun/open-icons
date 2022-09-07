module.exports = {
    name: 'framework7-icons',
    url: 'https://github.com/framework7io/framework7-icons',

    moduleFilters: 'svg',

    dirs: 'svg',

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace(/_/g, '-');

        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
