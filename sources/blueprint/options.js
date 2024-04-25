const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@blueprintjs/icons',
    url: 'https://github.com/palantir/blueprint',

    moduleInit: function(modulePath, Util) {

        const dir = Util.createSvgDir();

        const bundle = require(modulePath);
        // console.log(bundle);

        const keys = Object.keys(bundle);
        // console.log(keys.length);

        keys.forEach((k) => {

            // console.log(k);
            const Icon = bundle[k];
            if (!Icon || !Icon.render) {
                return;
            }

            const svg = Helper.renderReactIcon(Icon, {
                size: 20
            });

            // console.log(svg);
            if (!svg) {
                return;
            }

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

    }
};
