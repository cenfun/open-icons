module.exports = {
    package: '@carbon/icons',
    url: 'https://github.com/carbon-design-system/carbon',
    dirs: 'node_modules/@carbon/icons/svg/32',
    readme: '',
    license: 'Apache 2.0',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },
    onSVGName: function(name, item) {
        //replace -- to -
        name = name.split(/-+/).join('-');
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    }
};