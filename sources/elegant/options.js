const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'elegant-icon-font',
    url: 'https://www.elegantthemes.com/blog/resources/elegant-icon-font',
    download: {
        url: 'https://www.elegantthemes.com/icons/elegant_font.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'elegant_font');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);
        }
    },

    decompress: {
        filter: (file) => {
            return file.path.startsWith('elegant_font/images/SVG');
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
