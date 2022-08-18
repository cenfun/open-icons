module.exports = {
    package: 'flat-color-icons',
    url: 'https://github.com/icons8/flat-color-icons',
    dirs: 'node_modules/flat-color-icons/svg',
    readme: 'Fixed Color',
    license: 'MIT',
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    }
};