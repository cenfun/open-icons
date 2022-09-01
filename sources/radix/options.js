const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@radix-ui/react-icons',
    url: 'https://github.com/radix-ui/icons',
    dirs: function(item, Util) {

        const dir = 'node_modules/@radix-ui/react-icons/svg';
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const bundle = require('@radix-ui/react-icons');
        const keys = Object.keys(bundle);
        //console.log(keys);
        keys.forEach((k) => {

            const v = bundle[k];

            if (typeof v.render !== 'function') {
                console.log(`Not found render function: ${k}`);
                return;
            }

            const props = v.render({
                color: 'currentColor'
            });
            //console.log(props);

            const svg = Helper.createSvgFromReact(props);
            //console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);


        });

        return dir;
    }
};
