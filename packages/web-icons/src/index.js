
import decompress from 'lz-utils/lib/decompress.js';
import icons from './icons.json';

const load = (path = './', callback = (item, info) => {}) => {
    return new Promise((resolve, reject) => {

        const list = Object.keys(icons);

        const totalNum = list.length;
        const totalSize = list.reduce((v, k) => v + icons[k].size, 0);

        const loadedIcons = {};

        let loadedNum = 0;
        let loadedSize = 0;
        const loadHandler = function(k, itemName) {
            loadedNum += 1;

            const item = JSON.parse(decompress(window[itemName]));

            const sizeInfo = icons[k];
            loadedSize += sizeInfo.size;

            Object.assign(item, sizeInfo);

            loadedIcons[k] = item;

            const info = {
                loadedSize,
                totalSize,
                loadedNum,
                totalNum
            };

            callback(item, info);

            if (loadedNum >= totalNum) {
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

export { icons, load };

export default icons;
