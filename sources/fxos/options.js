const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'fxos-icons',
    url: 'https://github.com/fxos-components/fxos-icons',
    download: {
        url: 'https://github.com/fxos-components/fxos-icons/archive/refs/heads/master.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'fxos-icons-master');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);
        }
    },

    dirs: 'images',

    onSVGContent: function(content) {

        content = content.split('fill="#000000"').join('fill="currentColor"');
        content = content.split('fill="#040000"').join('fill="currentColor"');
        content = content.split('fill: #848484').join('fill: currentColor');

        return content;
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
