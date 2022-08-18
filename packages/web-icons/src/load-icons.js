
import decompress from 'lz-utils/lib/decompress.js';
import icons from './icons.json';

const initSvg = (item, contents) => {
    const list = ['<svg pointer-events="none" width="100%" height="100%"'];
    if (item.viewBox) {
        list.push(` viewBox="${item.viewBox}"`);
    }
    if (item.preserveAspectRatio) {
        list.push(` preserveAspectRatio="${item.preserveAspectRatio}"`);
    }
    const content = contents[item.content];
    list.push(`>${content}</svg>`);
    const svg = list.join('');

    item.svg = svg;
};

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

            item.icons.forEach((it) => {
                initSvg(it, item.contents);
            });

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

export default loadIcons;
