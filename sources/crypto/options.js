module.exports = {
    name: 'cryptocurrency-icons',
    url: 'https://github.com/spothq/cryptocurrency-icons',

    decompress: {
        filter: (file) => {
            return file.path === 'package/package.json' || file.path.startsWith('package/svg/color');
        }
    },

    dirs: 'svg/color',

    onSVGName: function(name, item) {
        name = name.replace('$', '');
        return this.onSVGNameDefault(name, item);
    }

};
