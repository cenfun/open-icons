module.exports = {
    name: 'jam-icons',
    url: 'https://github.com/michaelampr/jam',
    dirs: 'svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }

};
