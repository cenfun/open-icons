
import decompress from 'lz-utils/lib/decompress.js';
import icons from './icons.js';
import stats from './stats.json';

const iconList = Object.keys(stats);
const iconTotal = iconList.length;

const webIcons = iconList.map((k) => {
    return {
        name: k,
        ... stats[k]
    };
});

webIcons.decompress = (callback) => {
    if (typeof callback !== 'function') {
        callback = () => {};
    }

    return iconList.map((k, i) => {
        const item = JSON.parse(decompress(icons[k]));
        callback(k, i, iconTotal, item);
        return Object.assign(item, stats[k]);
    });
};

export default webIcons;
