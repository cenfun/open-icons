const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@wordpress/icons',
    url: 'https://github.com/WordPress/gutenberg',
    dirs: function(Util) {

        const dir = path.resolve(this.modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const entryPath = path.resolve(this.modulePath, 'src/library');
        const files = fs.readdirSync(entryPath);

        files.forEach((filename) => {
            // const excludes = [];
            // if (excludes.includes(k)) {
            //     return;
            // }
            const content = fs.readFileSync(path.resolve(entryPath, filename), {
                encoding: 'utf-8'
            });

            const str = Helper.cut(content, [['<SVG', '</SVG>']]);
            //console.log(str);

            let svg = str.replace(/SVG/g, 'svg');
            svg = svg.replace(/Path/g, 'path');
            //console.log(k, v, svg);

            const k = path.basename(filename, '.js');
            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }

};