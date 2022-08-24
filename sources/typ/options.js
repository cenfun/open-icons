module.exports = {
    name: 'typicons.font',
    url: 'https://github.com/stephenhutchings/typicons.font',
    dirs: 'node_modules/typicons.font/src/svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
