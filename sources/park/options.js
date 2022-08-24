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
    name: '@icon-park/svg',
    url: 'https://github.com/bytedance/IconPark',
    dirs: function(item, Util) {

        const dir = 'node_modules/@icon-park/svg/svg';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const bundle = require('@icon-park/svg');
        const keys = Object.keys(bundle);
        //console.log(keys);
        keys.forEach((k) => {
            if (k === 'setConfig' || k === 'DEFAULT_ICON_CONFIGS') {
                return;
            }

            const v = bundle[k];
            if (typeof v !== 'function') {
                console.log(k);
                return;
            }

            const svg = v({});
            if (svg) {
                fs.writeFileSync(path.resolve(dir, `${pascalToKebabCase(k)}.svg`), svg);
            }

        });

        return dir;
    }
};
