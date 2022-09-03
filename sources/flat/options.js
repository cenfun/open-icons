module.exports = {
    name: 'flat-color-icons',
    url: 'https://github.com/icons8/flat-color-icons',
    dirs: 'svg',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    },

    readme: 'Fixed color'
};
