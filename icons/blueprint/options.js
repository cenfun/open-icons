const fs = require('fs');
const path = require('path');


const pascalToKebabCase = (text) => {
    return (`${text}`).trim()
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\W/g, (m) => ((/[À-ž]/).test(m) ? m : '-'))
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-')
        .toLowerCase();
};

module.exports = {
    package: '@blueprintjs/icons',
    url: 'https://github.com/palantir/blueprint',
    dirs: function(item, Util) {

        const dir = 'node_modules/@blueprintjs/icons/svg';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const Icons = require('@blueprintjs/icons');
        const keys = Object.keys(Icons.IconSvgPaths20);

        //console.log(keys.length);

        keys.forEach((k) => {

            //console.log(k);
            const v = Icons.IconSvgPaths20[k];

            let ps = v.map((d) => {
                return `<path d="${d}" fill-rule="evenodd" fill="currentColor"></path>`;
            }).join('\n');

            if (!ps) {
                console.log(k);
                ps = '<path d="M0,0 L1,1z" fill-rule="evenodd" fill="currentColor"></path>';
            }

            const svg = `<svg viewBox="0 0 20 20">${ps}</svg>`;

            fs.writeFileSync(path.resolve(dir, `${Icons.IconNames[k]}.svg`), svg);


        });

        return dir;
    },
    readme: '',
    license: 'Apache 2.0'
};
