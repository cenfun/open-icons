module.exports = {
    package: 'boxicons',
    url: 'https://github.com/atisawd/boxicons',
    dirs: 'node_modules/boxicons/svg',
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('viewBox', '0 0 24 24');
        $svg.attr('fill', 'currentColor');
    }
};