const initSvg = function(icon, size = '100%') {

    // round
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
        delete icon.viewBox;
    }

    list.push(` width="${size}" height="${size}"`);
    if (icon.preserveAspectRatio) {
        list.push(` preserveAspectRatio="${icon.preserveAspectRatio}"`);
        delete icon.preserveAspectRatio;
    }
    list.push(' pointer-events="none" xmlns="http://www.w3.org/2000/svg">');

    list.push(icon.content);
    delete icon.content;

    list.push('</svg>');

    const svg = list.join('');
    const prefixPlaceholder = '{prefix}';
    const hasPrefix = svg.indexOf(prefixPlaceholder) !== -1;
    let n = 0;
    if (hasPrefix) {
        // dynamic prefix
        Object.defineProperty(icon, 'svg', {
            get: function() {
                n += 1;
                const uid = `${icon.id}-${n}`;
                return svg.split(prefixPlaceholder).join(uid);
            }
        });
    } else {
        icon.svg = svg;
    }

};

export default initSvg;
