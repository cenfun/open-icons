module.exports = {
    name: 'elegant-icon-font',
    url: 'https://www.elegantthemes.com/blog/resources/elegant-icon-font',
    downloadUrl: 'https://www.elegantthemes.com/icons/elegant_font.zip',
    moduleEntry: 'elegant_font',

    decompress: {
        filter: (file) => {
            return file.path === 'elegant_font/package.json' || file.path.startsWith('elegant_font/images/SVG');
        }
    },

    license: 'GPL 2.0 and MIT',
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
