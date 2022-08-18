module.exports = {
    package: 'primeicons',
    url: 'https://github.com/primefaces/primeicons',
    dirs: 'node_modules/primeicons/raw-svg',
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};