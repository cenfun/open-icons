module.exports = {
    name: '@iconscout/unicons',
    url: 'https://github.com/Iconscout/unicons',
    dirs: [
        'node_modules/@iconscout/unicons/svg/line',
        {
            solid: 'node_modules/@iconscout/unicons/svg/solid'
        }
    ],

    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};
