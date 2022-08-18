module.exports = {
    package: 'typicons.font',
    url: 'https://github.com/stephenhutchings/typicons.font',
    dirs: 'node_modules/typicons.font/src/svg',
    readme: '',
    license: 'SIL Open Font',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};