const fs = require('fs');
const path = require('path');

module.exports = {
    name: '@blueprintjs/icons',
    url: 'https://github.com/palantir/blueprint',
    dirs: function(name, Util) {

        const dir = path.resolve(this.modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const bundle = require(path.resolve(this.modulePath));
        const keys = Object.keys(bundle.IconSvgPaths20);

        //console.log(keys.length);

        keys.forEach((k) => {

            //console.log(k);
            const v = bundle.IconSvgPaths20[k];

            let ps = v.map((d) => {
                return `<path d="${d}" fill-rule="evenodd" fill="currentColor"></path>`;
            }).join('\n');

            if (!ps) {
                console.log(k);
                ps = '<path d="M0,0 L1,1z" fill-rule="evenodd" fill="currentColor"></path>';
            }

            const svg = `<svg viewBox="0 0 20 20">${ps}</svg>`;

            fs.writeFileSync(path.resolve(dir, `${bundle.IconNames[k]}.svg`), svg);


        });

        return dir;
    }
};
