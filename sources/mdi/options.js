module.exports = {
    name: '@mdi/svg',
    url: 'https://github.com/Templarian/MaterialDesign-SVG',
    dirs: 'node_modules/@mdi/svg/svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
