module.exports = {
    package: 'ionicons',
    url: 'https://github.com/ionic-team/ionicons',
    dirs: 'node_modules/ionicons/dist/svg',
    exclude: ['*-sharp.svg'],
    readme: 'No sharp icons',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};