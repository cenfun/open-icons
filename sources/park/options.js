const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@icon-park/svg',
    url: 'https://github.com/bytedance/IconPark',

    moduleInit: function(modulePath, Util) {

        const dir = Util.createSvgDir();

        const bundle = require(path.resolve(modulePath));
        const keys = Object.keys(bundle);
        // console.log(keys);
        keys.forEach((k) => {
            const excludes = ['setConfig', 'DEFAULT_ICON_CONFIGS'];
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
                fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);
            } else {
                console.log(`Failed to create svg: ${k}`);
            }

        });

    }
};
