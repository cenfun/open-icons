const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: 'antd-mobile-icons',
    url: 'https://github.com/awmleer/antd-mobile-icons',
    dirs: function(name, Util) {

        const dir = path.resolve(this.modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const bundle = require(path.resolve(this.modulePath));
        const keys = Object.keys(bundle);
        // console.log(keys);

        keys.forEach((k) => {
            const excludes = [];
            if (excludes.includes(k)) {
                return;
            }

            const v = bundle[k];
            //console.log(v);

            const props = v({});
            //console.log(props);

            const svg = Helper.createSvgFromReact(props);
            //console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    }
};
