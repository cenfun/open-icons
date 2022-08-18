module.exports = {
    package: 'ikonate',
    url: 'https://github.com/mikolajdobrucki/ikonate',
    dirs: 'node_modules/ikonate/icons',
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'none');
        $svg.attr('stroke', 'currentColor');
        $svg.attr('stroke-width', '2');
        $svg.attr('stroke-linecap', 'round');
        $svg.attr('stroke-linejoin', 'round');
    }
};