
import packages from './packages.json';
import decompress from 'lz-utils/lib/decompress.js';

import loadPackages from './load-packages.js';

import initSvg from './init-svg.js';

import defineIconElement from './define-icon-element.js';

const version = window.VERSION;
const timestamp = window.TIMESTAMP;

export {
    packages,
    decompress,

    loadPackages,

    initSvg,

    defineIconElement,

    version,
    timestamp
};

export default packages;
