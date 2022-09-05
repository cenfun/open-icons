module.exports = {
    name: 'open-iconic',
    url: 'https://github.com/iconic/open-iconic',

    moduleFilters: 'svg',

    dirs: 'svg',

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
