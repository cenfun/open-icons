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

            //create package.json
            const jsonPath = path.resolve(newPath, 'package.json');
            Util.writeJSONSync(jsonPath, {
                name: this.name,
                version: '1.0.0',
                license: 'Free'
            });
        }
    },
    dirs: 'SVG',

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
        if (item.name === 'search') {
            $svg.find('path').attr('fill', 'currentColor');
        }
    }

};
