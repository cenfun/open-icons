module.exports = {
    name: 'typicons.font',
    url: 'https://github.com/stephenhutchings/typicons.font',
    dirs: 'src/svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
