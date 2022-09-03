module.exports = {
    name: '@iconscout/unicons',
    url: 'https://github.com/Iconscout/unicons',
    dirs: ['svg/solid', {
        line: 'svg/line'
    }],

    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    }
};
