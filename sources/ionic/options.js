module.exports = {
    name: 'ionicons',
    url: 'https://github.com/ionic-team/ionicons',
    dirs: 'node_modules/ionicons/dist/svg',
    exclude: ['*-sharp.svg'],

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },

    readme: 'Without sharp icons'
};
