
import decompress from 'lz-utils/lib/decompress.js';
import icons from './icons.json';

const load = (path = './', callback = (item, loaded, total) => {}) => {
    return new Promise((resolve, reject) => {

        const list = Object.keys(icons);

        const total = list.length;

        const loadedIcons = {};

        let loaded = 0;
        const loadHandler = function(k, itemName) {
            loaded += 1;

            const item = JSON.parse(decompress(window[itemName]));

            Object.assign(item, icons[k]);

            loadedIcons[k] = item;

            callback(item, loaded, total);

            // $loadingLabel.innerHTML = `${item} ... ${per}% loaded`;
            // renderMenu(metadata);
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

export { icons, load };

export default icons;
