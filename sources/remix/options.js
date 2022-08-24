module.exports = {
    name: 'remixicon',
    url: 'https://github.com/Remix-Design/RemixIcon',
    dirs: 'node_modules/remixicon/icons',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
