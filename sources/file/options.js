const Helper = require('../../scripts/helper.js');

module.exports = {
    name: 'file-icons',
    url: 'https://github.com/file-icons/icons',
    downloadUrl: 'https://github.com/file-icons/icons/archive/refs/heads/master.zip',
    moduleEntry: 'icons-master',

    license: 'ISC',

    moduleFilters: 'svg',
    dirs: 'svg',

    onSVGName: function(name, item) {
        name = name.replace('#', '-sharp');
        name = Helper.pascalToKebabCase(name);
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
        $svg.attr('viewBox', '0 0 512 512');
    },

    onSVGOptimized: function($svg, item, $) {
        ['g', 'path'].forEach((tag) => {
            $svg.find(tag).each((i, it) => {
                const $elem = $(it);
                const fill = $elem.attr('fill');
                if (fill && fill !== 'none') {
                    $elem.attr('fill', 'currentColor');
                }
                const stroke = $elem.attr('stroke');
                if (stroke && stroke !== 'none') {
                    $elem.attr('stroke', 'currentColor');
                }
            });
        });
    }

};
