const fs = require('fs');
const path = require('path');

module.exports = {
    name: '@fortawesome/free-solid-svg-icons',
    url: 'https://github.com/FortAwesome/Font-Awesome',

    moduleInit: function(modulePath, Util) {

        const dir = Util.createSvgDir();

        const bundle = require(path.resolve(modulePath));
        const keys = Object.keys(bundle);

        keys.forEach((k) => {

            const info = bundle[k];
            if (!info) {
                console.log(k);
                return;
            }
            const icon = info.icon;
            if (!icon) {
                console.log(k);
                return;
            }

            const w = icon[0];
            const h = icon[1];
            const d = icon[4];
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">
                <path fill="currentColor" d="${d}"/>
            </svg>
            `;

            fs.writeFileSync(path.resolve(dir, `${info.iconName}.svg`), svg);

        });

    }
};
