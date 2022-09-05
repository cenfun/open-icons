const fs = require('fs');
const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'elementor-icons',
    url: 'https://github.com/elementor/elementor-icons',
    download: {
        url: 'https://github.com/elementor/elementor-icons/archive/refs/heads/master.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'elementor-icons-master');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);
        }
    },

    dirs: function(Util) {
        const modulePath = this.modulePath;

        SFE({
            input: path.resolve(modulePath, 'fonts/eicons.svg'),
            output: path.resolve(modulePath, 'svg')
        });

        return 'svg';
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
