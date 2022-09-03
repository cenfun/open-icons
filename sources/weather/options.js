module.exports = {
    name: 'weather-icons-npm',
    url: 'https://github.com/erikflowers/weather-icons',
    dirs: 'svg',

    onSVGName: function(name, item) {
        name = name.replace(/\s+/i, '');
        name = name.replace(/^wi-/i, '');
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};
