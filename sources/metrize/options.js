const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'metrize-icons',
    url: 'https://www.alessioatzeni.com/metrize-icons/',
    download: {
        url: 'https://www.alessioatzeni.com/wp-content/themes/az/_include/metrize/custom/metrize-icons/download/Metrize_Icons.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'Metrize_Icons');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);
        }
    },

    decompress: {
        filter: (file) => {
            return file.path.startsWith('Metrize_Icons/SVG');
        }
    },

    license: 'Free',
    dirs: 'SVG',

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
        if (item.name === 'search') {
            $svg.find('path').attr('fill', 'currentColor');
        }
    }

};
