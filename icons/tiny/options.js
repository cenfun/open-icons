module.exports = {
    package: 'super-tiny-icons',
    url: 'https://github.com/edent/SuperTinyIcons',
    dirs: 'node_modules/super-tiny-icons/images/svg',
    readme: '',
    license: 'MIT',
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg) {
        //$svg.attr('fill', 'currentColor');
    }
};
