module.exports = {
    package: 'weather-icons-npm',
    url: 'https://github.com/erikflowers/weather-icons',
    dirs: 'node_modules/weather-icons-npm/svg',
    readme: '',
    license: 'SIL OFL 1.1',
    onSVGName: function(name, item) {
        name = name.replace(/\s+/i, '');
        name = name.replace(/^wi-/i, '');
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};