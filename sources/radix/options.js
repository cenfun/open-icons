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

const createTag = function(option) {

    //console.log(option);

    const { type, props } = option;

    const ts = Object.keys(props).map(function(name) {
        if (name === 'children') {
            return '';
        }
        const v = props[name];
        if (!v) {
            return '';
        }

        if (name !== 'viewBox') {
            name = pascalToKebabCase(name);
        }

        return `${name}="${v}"`;
    }).filter((it) => it);

    ts.unshift(type);
    let children = props.children;
    if (children) {
        if (!Array.isArray(children)) {
            children = [children];
        }
        const cs = children.map((child) => {
            return createTag(child);
        });
        return `<${ts.join(' ')}>${cs.join('')}</${type}>`;
    }

    return `<${ts.join(' ')}/>`;

};

module.exports = {
    name: '@radix-ui/react-icons',
    url: 'https://github.com/radix-ui/icons',
    dirs: function(item, Util) {

        const dir = 'node_modules/@radix-ui/react-icons/svg';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const bundle = require('@radix-ui/react-icons');
        const keys = Object.keys(bundle);
        //console.log(keys);
        keys.forEach((k) => {

            const v = bundle[k];

            if (typeof v.render !== 'function') {
                console.log(k);
                return;
            }

            const props = v.render({
                color: 'currentColor'
            });
            //console.log(props);

            const svg = createTag(props);
            //console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${pascalToKebabCase(k)}.svg`), svg);


        });

        return dir;
    }
};
