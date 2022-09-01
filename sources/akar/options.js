const fs = require('fs');
const path = require('path');
const Util = require('../../scripts/util.js');

module.exports = {
    name: 'akar-icons',
    url: 'https://github.com/artcoholic/akar-icons',
    dirs: function(item, U) {

        const dir = 'node_modules/akar-icons/svg';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const bundle = require('akar-icons');
        const keys = Object.keys(bundle);
        //console.log(keys);
        keys.forEach((k) => {

            const v = bundle[k];
            if (typeof v !== 'function') {
                console.log(`Not found render function: ${k}`);
                return;
            }

            const props = v(v.defaultProps);

            const svg = Util.createSvgFromReact(props);

            fs.writeFileSync(path.resolve(dir, `${Util.pascalToKebabCase(k)}.svg`), svg);


        });

        return dir;
    }

};
