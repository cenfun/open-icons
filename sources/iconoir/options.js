module.exports = {
    name: 'iconoir',
    url: 'https://github.com/lucaburgio/iconoir',
    dirs: 'icons',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split(/\s+/).join('-');
        return this.onSVGNameDefault(name, item);
    }
};
