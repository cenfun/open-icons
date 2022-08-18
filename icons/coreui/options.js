module.exports = {
    package: '@coreui/icons',
    url: 'https://github.com/coreui/coreui-icons',
    dirs: [
        'node_modules/@coreui/icons/svg/free'
    ],
    readme: '',
    license: 'CC BY 4.0',
    onSVGName: function(name, item) {
        name = name.replace(/^cil-/i, '');
        return this.onSVGNameDefault(name, item);
    }
};