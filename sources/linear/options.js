module.exports = {
    name: 'linearicons',
    url: 'https://github.com/cjpatoilo/linearicons',
    dirs: 'node_modules/linearicons/dist/svg',

    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }

};
