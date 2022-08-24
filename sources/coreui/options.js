module.exports = {
    name: '@coreui/icons',
    url: 'https://github.com/coreui/coreui-icons',
    dirs: [
        'node_modules/@coreui/icons/svg/free'
    ],
    onSVGName: function(name, item) {
        name = name.replace(/^cil-/i, '');
        return this.onSVGNameDefault(name, item);
    }
};
