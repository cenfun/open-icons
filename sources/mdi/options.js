module.exports = {
    name: '@mdi/svg',
    url: 'https://github.com/Templarian/MaterialDesign-SVG',
    dirs: 'svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
