const fs = require('fs');
const path = require('path');

module.exports = {
    debug: true,
    name: 'elusive-iconfont',
    url: 'https://github.com/dovy/elusive-iconfont',
    download: {
        url: 'https://github.com/dovy/elusive-iconfont/archive/refs/heads/master.zip',
        handler: function(Util) {
            const oldPath = path.resolve(this.sourcePath, 'elusive-iconfont-master');
            const newPath = path.resolve(this.sourcePath, 'package');
            fs.renameSync(oldPath, newPath);

            //create package.json
            const jsonPath = path.resolve(newPath, 'package.json');
            Util.writeJSONSync(jsonPath, {
                name: this.name,
                version: '1.0.0',
                license: 'SIL'
            });
        }
    },
    dirs: 'dev/icons-svg',

    onSVGContent: function(content, item) {
        content = content.split('fill:#000000').join('fill:currentColor');
        content = content.split('fill="#000"').join('fill="currentColor"');
        return content;
    },

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
    }

};