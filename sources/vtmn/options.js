
module.exports = {
    name: '@vtmn/icons',
    url: 'https://github.com/Decathlon/vitamin-web',
    dirs: 'node_modules/@vtmn/icons/dist/vitamix/svg',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.replace(/\s/g, '-');
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
