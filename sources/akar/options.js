const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: 'akar-icons',
    url: 'https://github.com/artcoholic/akar-icons',

    moduleInit: function(Util, modulePath) {

        const dir = path.resolve(modulePath, 'svg');
        fs.mkdirSync(dir);

        const entryPath = path.resolve(modulePath, 'dist/index.js');

        const bundle = Helper.executeCode(entryPath, Helper.dependencies);

        const keys = Object.keys(bundle);
        // console.log(keys);
        keys.forEach((k) => {

            const v = bundle[k];
            if (typeof v !== 'function') {
                console.log(`Not found render function: ${k}`);
                return;
            }

            const props = v(v.defaultProps);
            // console.log(props);

            const svg = Helper.createSvgFromReact(props);
            // console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

    }

};
