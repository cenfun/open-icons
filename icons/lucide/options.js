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

const createTag = function(tag, attrs, children) {

    const ts = Object.keys(attrs).map(function(name) {
        return `${name}="${attrs[name]}"`;
    });

    ts.unshift(tag);

    if (children && children.length) {
        const cs = children.map(function(child) {
            return createTag(child[0], child[1], child[2]);
        });
        return `<${ts.join(' ')}>${cs.join('')}</${tag}>`;
    }

    return `<${ts.join(' ')}/>`;

};

module.exports = {
    name: 'lucide',
    url: 'https://github.com/lucide-icons/lucide',
    dirs: function(item, Util) {

        const dir = 'node_modules/lucide/svg';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const bundle = require('lucide');
        const keys = Object.keys(bundle);
        //console.log(keys);
        keys.forEach((k) => {
            if (k === 'createElement' || k === 'createIcons' || k === 'icons') {
                return;
            }

            const v = bundle[k];
            const svg = createTag(v[0], v[1], v[2]);
            //console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    },
    readme: '',
    license: 'ISC'
};
