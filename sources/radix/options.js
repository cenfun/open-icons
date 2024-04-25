const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@radix-ui/react-icons',
    url: 'https://github.com/radix-ui/icons',

    moduleInit: function(modulePath, Util) {

        const dir = Util.createSvgDir();

        const entryPath = path.resolve(modulePath, 'dist/react-icons.cjs.development.js');

        const bundle = Helper.executeCode(entryPath, Helper.dependencies);

        const keys = Object.keys(bundle);
        // console.log(keys);

        keys.forEach((k) => {

            const v = bundle[k];
            // console.log(v);

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
