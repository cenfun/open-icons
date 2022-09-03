module.exports = {
    name: 'line-awesome',
    url: 'https://github.com/icons8/line-awesome',
    dirs: 'svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }

};
