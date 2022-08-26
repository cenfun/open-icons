
import packages from './packages.json';
import decompress from 'lz-utils/lib/decompress.js';

import loadPackages from './load-packages.js';

import getSvg from './get-svg.js';
import getSvgSymbol from './get-svg-symbol.js';

import initIcons from './init-icons.js';
import getIconElement from './get-icon-element.js';

const version = window.VERSION;
const timestamp = window.TIMESTAMP;

export {
    packages,
    decompress,

    loadPackages,

    getSvg,
    getSvgSymbol,

    initIcons,
    getIconElement,

    version,
    timestamp
};

export default packages;
