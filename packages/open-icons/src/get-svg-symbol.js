const getAttrs = function(attrs) {
    if (!attrs) {
        return '';
    }
    return Object.keys(attrs).map(function(k) {
        const v = attrs[k];
        if (!v) {
            return '';
        }
        return `${k}="${v}"`;
    }).filter((it) => it).join(' ');
};

const getSvgSymbol = function(icons, dtd) {
    const ls = [];

    if (dtd) {
        ls.push('<?xml version="1.0" encoding="UTF-8"?>');
        ls.push('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
    }

    ls.push('<svg xmlns="http://www.w3.org/2000/svg">');

    icons.forEach(function(icon) {
        const attrs = {
            id: icon.namespace,
            viewBox: icon.viewBox,
            preserveAspectRatio: icon.preserveAspectRatio
        };
        const symbolAttrs = getAttrs(attrs);
        ls.push(`<symbol ${symbolAttrs}>`);
        ls.push(icon.content);
        ls.push('</symbol>');
    });

    ls.push('</svg>');

    return ls.join('');
};


export default getSvgSymbol;
