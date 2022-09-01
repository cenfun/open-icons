const fs = require('fs');
const path = require('path');
const Util = require('../../scripts/util.js');

module.exports = {
    name: '@sanity/icons',
    url: 'https://github.com/sanity-io/design',
    dirs: function(item, U) {

        const dir = 'node_modules/@sanity/icons/svg';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const bundle = require('@sanity/icons');
        const keys = Object.keys(bundle);
        //console.log(keys);

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
            //console.log(props);

            const svg = Util.createSvgFromReact(props);
            //console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Util.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    }

};
