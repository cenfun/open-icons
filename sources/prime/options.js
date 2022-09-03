module.exports = {
    name: 'primeicons',
    url: 'https://github.com/primefaces/primeicons',
    dirs: 'raw-svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
