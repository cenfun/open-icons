module.exports = {
    name: 'ikonate',
    url: 'https://github.com/mikolajdobrucki/ikonate',
    dirs: 'icons',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'none');
        $svg.attr('stroke', 'currentColor');
        $svg.attr('stroke-width', '2');
        $svg.attr('stroke-linecap', 'round');
        $svg.attr('stroke-linejoin', 'round');
    }
};
