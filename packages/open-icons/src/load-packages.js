
import decompress from 'lz-utils/lib/decompress.js';
import packages from './packages.json';

const initIcons = (pkg) => {

    const icons = pkg.icons;

    //init id and content
    icons.forEach((icon) => {
        icon.id = `${pkg.id}-${icon.name}`;

        const content = icon.content;
        if (typeof content === 'number') {
            //duplicate content
            icon.content = icons[content].content;
        }
    });

    return pkg;
};

const loadPackages = (path = './', callback = (item, info) => {}) => {
    return new Promise((resolve) => {

        const total = packages.length;
        const totalSize = packages.reduce((v, it) => v + it.size, 0);

        const loadedPackages = [];

        let loaded = 0;
        let loadedSize = 0;

        const loadHandler = function(it) {
            loaded += 1;

            const str = window[it.id].default;

            const pkg = JSON.parse(decompress(str));

            loadedSize += it.size;

            Object.assign(pkg, it);

            initIcons(pkg);

            loadedPackages.push(pkg);

            const info = {
                loadedSize,
                totalSize,
                loaded,
                total
            };

            callback(pkg, info);

            if (loaded >= total) {
                resolve(loadedPackages);
            }
        };

        packages.forEach((it) => {
            const url = `${path}${it.id}.js`;
            const $script = document.createElement('script');
            $script.src = url;
            $script.onload = function() {
                loadHandler(it);
            };
            $script.onerror = function(e) {
                console.error(e);
            };
            document.body.appendChild($script);
        });
    });
};

export default loadPackages;
