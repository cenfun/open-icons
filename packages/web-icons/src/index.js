
import packages from './packages.json';
import decompress from 'lz-utils/lib/decompress.js';

import loadPackages from './load-packages.js';
import initIcons from './init-icons.js';
import getIconElement from './get-icon-element.js';

const version = window.VERSION;
const timestamp = window.TIMESTAMP;

export {
    packages,
    decompress,

    loadPackages,
    initIcons,
    getIconElement,

    version,
    timestamp
};

export default packages;
