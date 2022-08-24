module.exports = {
    name: '@primer/octicons',
    url: 'https://github.com/primer/octicons',
    dirs: 'node_modules/@primer/octicons/build/svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
