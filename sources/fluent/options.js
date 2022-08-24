module.exports = {
    name: '@fluentui/svg-icons',
    url: 'https://github.com/microsoft/fluentui-system-icons',
    dirs: 'node_modules/@fluentui/svg-icons/icons',
    excludeSubDir: true,
    exclude: ['ic_fluent_*', '*_10_*', '*_12_*', '*_16_*', '*_24_*', '*_28_*', '*_32_*', '*_48_*'],
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_20_').join('-');
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    }
};
