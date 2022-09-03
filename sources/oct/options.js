module.exports = {
    name: '@primer/octicons',
    url: 'https://github.com/primer/octicons',
    dirs: 'build/svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
