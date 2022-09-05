const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'fontisto',
    url: 'https://github.com/kenangundogan/fontisto',
    dirs: function(Util, modulePath) {

        Util.rmSync(path.resolve(modulePath, 'svg'));

        SFE({
            input: path.resolve(modulePath, 'fonts/fontisto/fontisto.svg'),
            output: path.resolve(modulePath, 'svg'),

            onSVGItem: function(item) {

                const name = item['glyph-name'];
                if (!name || !item.d) {
                    //console.log(item);
                    return;
                }

                item.name = name.replace(/_/g, '-');

                return item;
            }
        });

        return 'svg';
    },

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
    }

};
