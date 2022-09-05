const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: 'antd-mobile-icons',
    url: 'https://github.com/awmleer/antd-mobile-icons',
    dirs: function(Util, modulePath) {

        const dir = path.resolve(modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const entryPath = path.resolve(modulePath, 'cjs/index.js');

        const bundle = Helper.executeCode(entryPath, Helper.dependencies);

        const keys = Object.keys(bundle);
        //console.log(keys);

        keys.forEach((k) => {
            // const excludes = [];
            // if (excludes.includes(k)) {
            //     return;
            // }

            const v = bundle[k];
            //console.log(v);

            const root = v({});

            const svg = Helper.createSvgFromReact(root);
            //console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    }
};
