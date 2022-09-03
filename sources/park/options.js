const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@icon-park/svg',
    url: 'https://github.com/bytedance/IconPark',
    dirs: function(Util) {

        const dir = path.resolve(this.modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const bundle = require(path.resolve(this.modulePath));
        const keys = Object.keys(bundle);
        //console.log(keys);
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

        return dir;
    }
};
