module.exports = {
    package: 'cryptocurrency-icons',
    url: 'https://github.com/spothq/cryptocurrency-icons',
    dirs: 'node_modules/cryptocurrency-icons/svg/color',
    readme: '',
    license: 'CC0 1.0',
    onSVGName: function(name, item) {
        name = name.replace('$', '');
        return this.onSVGNameDefault(name, item);
    }
};