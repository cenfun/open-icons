module.exports = {
    name: 'elegant-icon-font',
    url: 'https://www.elegantthemes.com/blog/resources/elegant-icon-font',
    downloadUrl: 'https://www.elegantthemes.com/icons/elegant_font.zip',
    moduleEntry: 'elegant_font',

    license: 'GPL 2.0 and MIT',

    moduleFilters: 'images/SVG',
    dirs: 'images/SVG',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.replace(/_/g, '-');
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
