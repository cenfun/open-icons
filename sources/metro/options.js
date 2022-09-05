const path = require('path');
const Helper = require('../../scripts/helper.js');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'metro-icons',
    url: 'https://github.com/MfgLabs/mfglabs-iconset',

    downloadUrl: 'https://github.com/olton/Metro-UI-CSS/archive/refs/heads/master.zip',
    moduleEntry: 'Metro-UI-CSS-master',
    moduleFilters: 'icons/metro.svg',

    dirs: function(Util, modulePath) {

        SFE({
            input: path.resolve(modulePath, 'icons/metro.svg'),
            output: path.resolve(modulePath, 'svg'),
            onSVGItem: function(item) {

                let name = item['glyph-name'];
                if (!name || !item.d) {
                    //console.log(item);
                    return;
                }
                name = name.replace(/_/g, '-');
                name = Helper.pascalToKebabCase(name);

                item.name = name;

                return item;
            }
        });

        return 'svg';
    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
