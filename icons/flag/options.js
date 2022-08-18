module.exports = {
    package: 'country-flag-icons',
    url: 'https://gitlab.com/catamphetamine/country-flag-icons',
    dirs: {
        '1x1': 'node_modules/country-flag-icons/1x1',
        '3x2': 'node_modules/country-flag-icons/3x2'
    },
    readme: '',
    license: 'MIT',
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    }
};