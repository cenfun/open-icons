
const path = require('path');
const SFE = require('svg-font-extractor');

module.exports = {
    name: 'paymentfont',
    url: 'https://github.com/AlexanderPoellmann/PaymentFont',
    dirs: function(Util, modulePath) {

        SFE({
            input: path.resolve(modulePath, 'fonts/paymentfont-webfont.svg'),
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

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }

};
