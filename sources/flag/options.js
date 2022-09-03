module.exports = {
    name: 'country-flag-icons',
    url: 'https://gitlab.com/catamphetamine/country-flag-icons',
    dirs: ['1x1', {
        '3x2': '3x2'
    }],

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    }
};
