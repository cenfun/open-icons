const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'dripicons',
    url: 'https://github.com/amitjakhu/dripicons',
    download: {
        url: 'https://github.com/amitjakhu/dripicons/archive/refs/heads/master.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'dripicons-master');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);
        }
    },

    decompress: {
        filter: (file) => {
            return file.path.startsWith('dripicons-master/SVG');
        }
    },

    license: 'CC-BY-SA-4.0',
    dirs: 'SVG',

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
    }

};
