const fs = require('fs');
const path = require('path');

module.exports = {
    package: '@fortawesome/free-solid-svg-icons',
    url: 'https://github.com/FortAwesome/Font-Awesome',
    dirs: function(item, Util) {

        const dir = 'node_modules/@fortawesome/free-solid-svg-icons/svg';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const Map = require('@fortawesome/free-solid-svg-icons');
        const keys = Object.keys(Map);

        keys.forEach((k) => {

            const info = Map[k];
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


        return dir;
    },
    readme: '',
    license: 'CC BY 4.0'
};
