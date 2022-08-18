module.exports = {
    package: '@primer/octicons',
    url: 'https://github.com/primer/octicons',
    dirs: 'node_modules/@primer/octicons/build/svg',
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};