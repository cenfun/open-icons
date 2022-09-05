const fs = require('fs');
const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    debug: true,
    name: 'dashicons',
    url: 'https://github.com/WordPress/dashicons',
    download: {
        url: 'https://github.com/WordPress/dashicons/archive/refs/heads/master.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'dashicons-master');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);

            //has package.json, but no svg publish

        }
    },

    dirs: 'svg-min',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
