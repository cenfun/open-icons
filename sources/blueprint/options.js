const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@blueprintjs/icons',
    url: 'https://github.com/palantir/blueprint',
    dirs: function(Util) {

        const dir = path.resolve(this.modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const entryPath = path.resolve(this.modulePath, 'lib/cjs/index.js');

        const bundle = Helper.executeCode(entryPath, {
            'tslib': {
                __importStar: (v) => v,
                __assign: Object.assign
            },
            'change-case': {
                pascalCase: (v) => v,
                snakeCase: (v) => v
            }
        });

        const keys = Object.keys(bundle.IconSvgPaths20);
        //console.log(keys.length);

        keys.forEach((k) => {

            //console.log(k);
            const v = bundle.IconSvgPaths20[k];
            if (!v.length) {
                console.log(k, 'Not found path d');
                return;
            }

            const ps = v.map((d) => {
                return `<path d="${d}" fill-rule="evenodd" fill="currentColor"></path>`;
            }).join('');

            const svg = `<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">${ps}</svg>`;

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    }
};
