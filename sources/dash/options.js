const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'dashicons',
    url: 'https://github.com/WordPress/dashicons',
    download: {
        url: 'https://github.com/WordPress/dashicons/archive/refs/heads/master.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'dashicons-master');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);
        }
    },

    decompress: {
        filter: (file) => {
            return file.path.startsWith('dashicons-master/svg-min');
        }
    },

    dirs: 'svg-min',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
