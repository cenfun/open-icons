module.exports = {
    name: 'icomoon-free-npm',
    url: 'https://github.com/Keyamoon/IcoMoon-Free',

    decompress: {
        filter: (file) => {
            return file.path === 'package/package.json' || file.path.startsWith('package/SVG');
        }
    },

    dirs: 'SVG',

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
