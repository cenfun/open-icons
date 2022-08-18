module.exports = {
    package: '@mdi/svg',
    url: 'https://github.com/Templarian/MaterialDesign-SVG',
    dirs: 'node_modules/@mdi/svg/svg',
    readme: '',
    license: 'Apache 2.0',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};