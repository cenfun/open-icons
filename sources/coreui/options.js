module.exports = {
    name: '@coreui/icons',
    url: 'https://github.com/coreui/coreui-icons',

    decompress: {
        filter: (file) => {
            return file.path === 'package/package.json' || file.path.startsWith('package/svg');
        }
    },

    dirs: 'svg/free',

    onSVGName: function(name, item) {
        name = name.replace(/^cil-/i, '');
        return this.onSVGNameDefault(name, item);
    }

};
