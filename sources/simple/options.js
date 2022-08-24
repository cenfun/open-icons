module.exports = {
    name: 'simple-icons',
    url: 'https://github.com/simple-icons/simple-icons',
    dirs: 'node_modules/simple-icons/icons',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    }
};
