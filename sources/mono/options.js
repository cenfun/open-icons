module.exports = {
    name: 'mono-icons',
    url: 'https://github.com/mono-company/mono-icons',
    dirs: 'node_modules/mono-icons/svg',

    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};
