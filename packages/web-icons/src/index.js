
import decompress from 'lz-utils/lib/decompress.js';
import icons from './icons.json';
import getIconElement from './get-icon-element.js';

const loadIcons = (path = './', callback = (item, info) => {}) => {
    return new Promise((resolve, reject) => {

        const list = Object.keys(icons);

        const total = list.length;
        const totalSize = list.reduce((v, k) => v + icons[k].size, 0);

        const loadedIcons = {};

        let loaded = 0;
        let loadedSize = 0;
        const loadHandler = function(k, itemName) {
            loaded += 1;

            const item = JSON.parse(decompress(window[itemName]));

            const sizeInfo = icons[k];
            loadedSize += sizeInfo.size;

            Object.assign(item, sizeInfo);

            loadedIcons[k] = item;

            const info = {
                loadedSize,
                totalSize,
                loaded,
                total
            };

            callback(item, info);

            if (loaded >= total) {
                resolve(loadedIcons);
            }
        };

        list.forEach((k) => {
            const itemName = `web-icons-${k}`;
            const url = `${path}${itemName}.js`;
            const $script = document.createElement('script');
            $script.src = url;
            $script.onload = function() {
                loadHandler(k, itemName);
            };
            $script.onerror = function(e) {
                reject(k, e);
            };
            document.body.appendChild($script);
        });
    });
};

const version = window.VERSION;
const timestamp = window.TIMESTAMP;

export {
    version,
    timestamp,
    icons,
    loadIcons,
    getIconElement
};

export default icons;
