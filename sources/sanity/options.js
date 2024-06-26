const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@sanity/icons',
    url: 'https://github.com/sanity-io/icons',

    moduleInit: function(modulePath, Util) {

        const dir = Util.createSvgDir();

        const entryPath = path.resolve(modulePath, 'dist/index.cjs');

        const bundle = Helper.executeCode(entryPath, Helper.dependencies);

        const keys = Object.keys(bundle);
        console.log(keys);

        keys.forEach((k) => {
            const excludes = ['Icon', 'icons'];
            if (excludes.includes(k)) {
                return;
            }

            const v = bundle[k];

            if (typeof v.render !== 'function') {
                console.log(`Not found render function: ${k}`);
                return;
            }

            const props = v.render({
                color: 'currentColor'
            });
            // console.log(props);

            const svg = Helper.createSvgFromReact(props);
            // console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

    }

};
