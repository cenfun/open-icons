module.exports = {
    package: 'iconoir',
    url: 'https://github.com/lucaburgio/iconoir',
    dirs: [
        'node_modules/iconoir/icons'
    ],
    readme: '',
    license: 'MIT',
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split(/\s+/).join('-');
        return this.onSVGNameDefault(name, item);
    }
};