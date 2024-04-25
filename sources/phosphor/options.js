const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'phosphor-icons',
    url: 'https://github.com/phosphor-icons/phosphor-icons',

    moduleInit: function(modulePath, Util) {

        const dir = Util.createSvgDir();

        const bundle = require(path.resolve(modulePath, 'src/fonts/Phosphor.json'));

        bundle.icons.forEach((ic) => {

            const id = ic.properties.name;
            const paths = ic.icon.paths.map((d) => {
                return `<path fill="currentColor" d="${d}"/>`;
            });
            const s = 260;
            const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s} ${s}">
                ${paths}
            </svg>
            `;

            fs.writeFileSync(path.resolve(dir, `${id}.svg`), svg);

        });

    }
};
