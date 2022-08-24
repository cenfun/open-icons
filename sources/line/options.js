module.exports = {
    name: 'line-awesome',
    url: 'https://github.com/icons8/line-awesome',
    dirs: 'node_modules/line-awesome/svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }

};
