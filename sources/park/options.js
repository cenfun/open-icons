const fs = require('fs');
const path = require('path');
const Util = require('../../scripts/util.js');

module.exports = {
    name: '@icon-park/svg',
    url: 'https://github.com/bytedance/IconPark',
    dirs: function(item, U) {

        const dir = 'node_modules/@icon-park/svg/svg';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const bundle = require('@icon-park/svg');
        const keys = Object.keys(bundle);
        //console.log(keys);
        keys.forEach((k) => {
            const excludes = ['setConfigIcon', 'DEFAULT_ICON_CONFIGS'];
            if (excludes.includes(k)) {
                return;
            }

            const v = bundle[k];
            if (typeof v !== 'function') {
                console.log(`Not found render function: ${k}`);
                return;
            }

            const svg = v({});
            if (svg) {
                fs.writeFileSync(path.resolve(dir, `${Util.pascalToKebabCase(k)}.svg`), svg);
            }

        });

        return dir;
    }
};
