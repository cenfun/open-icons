import getSvg from './get-svg.js';

const initIcons = (pkg) => {
    const contents = pkg.contents;
    delete pkg.contents;

    pkg.tagName = `oi-${pkg.name}`;

    pkg.icons.forEach((icon) => {
        icon.namespace = `${pkg.namespace}-${icon.name}`;
        icon.content = contents[icon.content];
        icon.svg = getSvg(icon);
        delete icon.content;
    });

    return pkg;
};

export default initIcons;
