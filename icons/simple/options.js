module.exports = {
    package: 'simple-icons',
    url: 'https://github.com/simple-icons/simple-icons',
    dirs: 'node_modules/simple-icons/icons',
    readme: '',
    license: 'CC0 1.0',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    }
};
