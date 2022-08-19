const getSvg = (item) => {
    const list = ['<svg'];
    if (item.viewBox) {
        list.push(` viewBox="${item.viewBox}"`);
    }
    list.push(' width="100%" height="100%"');
    if (item.preserveAspectRatio) {
        list.push(` preserveAspectRatio="${item.preserveAspectRatio}"`);
    }
    list.push(' pointer-events="none" xmlns="http://www.w3.org/2000/svg">');
    list.push(item.content);
    list.push('</svg>');
    return list.join('');
};

const initIcons = (pkg) => {
    const contents = pkg.contents;
    delete pkg.contents;

    pkg.tagName = `wi-${pkg.name}`;

    pkg.icons.forEach((icon) => {
        icon.namespace = `${pkg.namespace}-${icon.name}`;
        icon.content = contents[icon.content];
        icon.svg = getSvg(icon);
        delete icon.content;
    });

    return pkg;
};

export default initIcons;
