module.exports = {
    name: 'primeicons',
    url: 'https://github.com/primefaces/primeicons',
    dirs: 'node_modules/primeicons/raw-svg',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
