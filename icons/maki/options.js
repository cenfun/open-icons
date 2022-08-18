module.exports = {
    package: '@mapbox/maki',
    url: 'https://github.com/mapbox/maki',
    dirs: 'node_modules/@mapbox/maki/icons',
    readme: '',
    license: 'CC0 1.0',
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};