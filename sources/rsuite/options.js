const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    debug: true,
    name: '@rsuite/icon-font',
    url: 'https://github.com/rsuite/rsuite-icons',
    dirs: function(name, Util) {

        const dir = path.resolve(this.modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const entryPath = path.resolve(this.modulePath, 'components');

        const extname = '.tsx';

        Util.forEachFile(entryPath, [extname], (filename, filePath) => {
            // const excludes = [];
            // if (excludes.includes(k)) {
            //     return;
            // }
            const content = fs.readFileSync(path.resolve(filePath, filename), {
                encoding: 'utf-8'
            });

            const str = Helper.cut(content, [['<svg', '</svg>']]);
            //console.log(str);

            const svg = str.split('ref={svgRef} {...props}').join('');
            // svg = svg.replace(/Path/g, 'path');
            // if (svg.indexOf('}') !== -1) {
            //     console.log(svg);
            // }

            const k = path.basename(filename, extname);
            //console.log(k);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    }

};
