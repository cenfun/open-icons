
const EC = require('eight-colors');

const Helper = {
    pascalToKebabCase: (text) => {
        return (`${text}`).trim()
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\W/g, (m) => ((/[À-ž]/).test(m) ? m : '-'))
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-')
            .toLowerCase();
    },

    createSvgFromReact: function(parent) {

        if (!parent) {
            throw new Error('[createSvgFromReact] invalid option');
        }

        //console.log(parent);

        const { type, props } = parent;

        if (!type || !props) {
            console.log(parent);
            throw new Error('[createSvgFromReact] invalid type or props');
        }

        let tagName = type;
        if (typeof tagName === 'function') {
            tagName = tagName.name.toLowerCase();
        }

        const ts = Object.keys(props).map(function(name) {
            if (name === 'children') {
                return '';
            }
            const v = props[name];
            if (!v) {
                return '';
            }

            if (name !== 'viewBox') {
                name = Helper.pascalToKebabCase(name);
            }

            return `${name}="${v}"`;
        }).filter((it) => it);

        ts.unshift(tagName);
        let children = props.children;
        if (children) {
            if (!Array.isArray(children)) {
                children = [children];
            }
            const cs = children.map((child) => {
                return Helper.createSvgFromReact(child);
            });
            return `<${ts.join(' ')}>${cs.join('')}</${tagName}>`;
        }

        return `<${ts.join(' ')} />`;

    },

    cut: function(str, list) {

        if (typeof str !== 'string') {
            console.log(EC.red(`Invalid string cut: ${str}`));
            return '';
        }

        if (!list.length) {
            return str;
        }

        const item = list.shift();
        const leftMatch = item[0];
        const leftIndex = str.indexOf(leftMatch);
        if (leftIndex !== -1) {
            str = str.substr(leftIndex);
        }

        const rightMatch = item[1];
        const rightIndex = str.indexOf(rightMatch);
        if (rightIndex !== -1) {
            str = str.substr(0, rightIndex + rightMatch.length);
        }

        return Helper.cut(str, list);
    }
};


module.exports = Helper;

