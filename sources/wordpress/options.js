const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    debug: true,
    name: '@wordpress/icons',
    url: 'https://github.com/WordPress/gutenberg',
    dirs: function(item, Util) {

        const dir = 'node_modules/@wordpress/icons/svg';
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const bundle = require('@wordpress/icons');
        const keys = Object.keys(bundle);
        //console.log(keys);

        keys.forEach((k) => {
            const excludes = ['Icon'];
            if (excludes.includes(k)) {
                return;
            }

            const v = bundle[k];

            const svg = Helper.createSvgFromReact(v);
            //console.log(k, v, svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }

};
