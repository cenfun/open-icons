module.exports = {
    package: 'remixicon',
    url: 'https://github.com/Remix-Design/RemixIcon',
    dirs: 'node_modules/remixicon/icons',
    readme: '',
    license: 'Apache 2.0',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};