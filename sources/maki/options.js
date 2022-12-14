module.exports = {
    name: '@mapbox/maki',
    url: 'https://github.com/mapbox/maki',
    dirs: 'icons',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};
