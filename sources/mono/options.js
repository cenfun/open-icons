module.exports = {
    name: 'mono-icons',
    url: 'https://github.com/mono-company/mono-icons',
    dirs: 'svg',

    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};
