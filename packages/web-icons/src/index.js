
import icons from './icons.json';
import decompress from 'lz-utils/lib/decompress.js';
import loadIcons from './load-icons.js';
import getIconElement from './get-icon-element.js';

const version = window.VERSION;
const timestamp = window.TIMESTAMP;

export {
    icons,
    decompress,
    loadIcons,
    getIconElement,
    version,
    timestamp
};

export default icons;
