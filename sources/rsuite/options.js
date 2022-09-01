const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@rsuite/icons',
    url: 'https://github.com/rsuite/rsuite-icons',
    dirs: function(item, Util) {

        const dir = 'node_modules/@rsuite/icons/svg';
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const bundle = require('@rsuite/icons');
        const keys = Object.keys(bundle);
        //console.log(keys);

        keys.forEach((k) => {
            const excludes = ['Icon', 'createIconFont', 'createSvgIcon', '__esModule'];
            if (excludes.includes(k)) {
                return;
            }

            const v = bundle[k];
            //console.log(k, v);

            if (typeof v.render !== 'function') {
                console.log(`Not found render function: ${k}`);
                return;
            }

            const root = v.render();

            const vn = root.props.as.render();

            const svg = Helper.createSvgFromReact(vn);
            // console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    }

};
