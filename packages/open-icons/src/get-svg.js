const getSvg = (icon) => {
    const list = ['<svg'];
    if (icon.viewBox) {
        list.push(` viewBox="${icon.viewBox}"`);
    }
    list.push(' width="100%" height="100%"');
    if (icon.preserveAspectRatio) {
        list.push(` preserveAspectRatio="${icon.preserveAspectRatio}"`);
    }
    list.push(' pointer-events="none" xmlns="http://www.w3.org/2000/svg">');
    list.push(icon.content);
    list.push('</svg>');
    return list.join('');
};

export default getSvg;
