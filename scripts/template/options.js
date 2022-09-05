// const fs = require('fs');
// const path = require('path');
// const EC = require('eight-colors');
// const SFE = require('svg-font-extractor');
// const Helper = require('../../scripts/helper.js');

module.exports = {
    //debug: true,
    name: 'xxx-icons',
    url: 'https://github.com/xxx-icons',

    // downloadUrl: 'https://github.com/xxx/master.zip',
    // moduleEntry: 'xxx-icons-master',
    // moduleFilters: 'fonts/xxx.svg',

    //license: 'CC BY 4.0',

    //dirs: 'svg',

    // dirs: ['inline-svg/filled', {
    //     outline: 'inline-svg/outlined'
    // }],

    // dirs: function(Util, modulePath) {

    //     SFE({
    //         input: path.resolve(modulePath, 'fonts/xxx.svg'),
    //         output: path.resolve(modulePath, 'svg'),
    //         onSVGItem: function(item) {

    //             const name = item['glyph-name'];
    //             if (!name || !item.d) {
    //                 //console.log(item);
    //                 return;
    //             }

    //             item.name = name.replace(/_/g, '-');

    //             return item;
    //         }
    //     });

    //     return 'svg';
    // },

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace(/_/g, '-');
        //name = Helper.pascalToKebabCase(name);

        return this.onSVGNameDefault(name, item);
    },

    // onSVGContent: function(content, item) {
    //     content = content.split('fill:#000000').join('fill:currentColor');
    //     content = content.split('fill="#000"').join('fill="currentColor"');
    //     return content;
    // },

    onSVGDocument: function($svg, item) {
        // let found = false;
        // ['path'].forEach((k) => {
        //     const $elem = $svg.find(k);
        //     const fill = $elem.attr('fill');
        //     if (fill && fill !== 'none') {
        //         $elem.attr('fill', 'currentColor');
        //         found = true;
        //     }
        // });
        // if (found) {
        //     return;
        // }
        $svg.attr('fill', 'currentColor');
    }

};
