module.exports = {
    name: 'icomoon-free-npm',
    url: 'https://github.com/Keyamoon/IcoMoon-Free',
    dirs: 'node_modules/icomoon-free-npm/SVG',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.replace(/^\d+-/, '');
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
    },

    license: 'CC BY 4.0 or GPL'
};
