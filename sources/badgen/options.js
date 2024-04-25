module.exports = {
    name: 'badgen-icons',
    url: 'https://github.com/badgen/badgen-icons',

    dirs: ['icons'],

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

        console.log($svg.html());
    }
};
