module.exports = {
    name: 'neuicons',
    url: 'https://github.com/neuicons/neu',

    moduleFilters: 'src/icons',

    dirs: 'src/icons',

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
