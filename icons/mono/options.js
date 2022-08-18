module.exports = {
    package: 'mono-icons',
    url: 'https://github.com/mono-company/mono-icons',
    dirs: 'node_modules/mono-icons/svg',
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};