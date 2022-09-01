const Helper = {
    pascalToKebabCase: (text) => {
        return (`${text}`).trim()
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\W/g, (m) => ((/[À-ž]/).test(m) ? m : '-'))
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-')
            .toLowerCase();
    },

    createSvgFromReact: function(option) {

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
                name = Helper.pascalToKebabCase(name);
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
                return Helper.createSvgFromReact(child);
            });
            return `<${ts.join(' ')}>${cs.join('')}</${type}>`;
        }

        return `<${ts.join(' ')}/>`;

    }
};


module.exports = Helper;

