module.exports = {
    name: 'remixicon',
    url: 'https://github.com/Remix-Design/RemixIcon',
    dirs: 'icons',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
