const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: 'file-icons',
    url: 'https://github.com/file-icons/icons',
    download: {
        url: 'https://github.com/file-icons/icons/archive/refs/heads/master.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'icons-master');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);
        }
    },

    decompress: {
        filter: (file) => {
            return file.path === 'icons-master/package.json' || file.path.startsWith('icons-master/svg');
        }
    },

    license: 'ISC',
    dirs: 'svg',

    onSVGName: function(name, item) {
        name = name.replace('#', '-sharp');
        name = Helper.pascalToKebabCase(name);
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
        $svg.attr('viewBox', '0 0 512 512');
    },

    onSVGOptimized: function($svg, item, $) {
        ['g', 'path'].forEach((tag) => {
            $svg.find(tag).each((i, it) => {
                const $elem = $(it);
                const fill = $elem.attr('fill');
                if (fill && fill !== 'none') {
                    $elem.attr('fill', 'currentColor');
                }
                const stroke = $elem.attr('stroke');
                if (stroke && stroke !== 'none') {
                    $elem.attr('stroke', 'currentColor');
                }
            });
        });
    }

};
