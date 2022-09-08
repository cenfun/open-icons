const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

const createSvg = function(tag, attrs, children) {

    const ts = Object.keys(attrs).map(function(name) {
        return `${name}="${attrs[name]}"`;
    });

    ts.unshift(tag);

    if (children && children.length) {
        const cs = children.map(function(child) {
            return createSvg(child[0], child[1], child[2]);
        });
        return `<${ts.join(' ')}>${cs.join('')}</${tag}>`;
    }

    return `<${ts.join(' ')}/>`;

};

module.exports = {
    name: 'lucide',
    url: 'https://github.com/lucide-icons/lucide',

    moduleInit: function(Util, modulePath) {

        const dir = path.resolve(modulePath, 'svg');
        fs.mkdirSync(dir);

        const bundle = require(path.resolve(modulePath));
        const keys = Object.keys(bundle);
        //console.log(keys);
        keys.forEach((k) => {
            const excludes = ['createElement', 'createIcons', 'icons'];
            if (excludes.includes(k)) {
                return;
            }

            const v = bundle[k];
            const svg = createSvg(v[0], v[1], v[2]);
            //console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

    }
};
