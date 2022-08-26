const getSvg = (icon, useSymbol) => {

    if (useSymbol) {
        return `<svg pointer-events="none" width="100%" height="100%"><use xlink:href="#${icon.namespace}" /></svg>`;
    }

    //round
    // <svg pointer-events="none" width="100%" height="100%">
    //     <mask id="${fullId}-mask">
    //         <rect rx="${radius}" ry="${radius}" fill="#ffffff" x="0" y="0" width="100%" height="100%" />
    //     </mask>
    //     <g mask="url(#${fullId}-mask)">
    //         <rect rx="${radius}" ry="${radius}" fill="${color}" x="0" y="0" width="100%" height="100%" />
    //         <use xlink:href="#${fullId}" />
    //     </g>
    // </svg>

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
