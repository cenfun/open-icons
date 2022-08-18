module.exports = {
    package: 'entypo',
    url: 'https://github.com/hypermodules/entypo',
    dirs: 'node_modules/entypo/src',
    readme: '',
    license: 'ISC',
    onSVGName: function(name, item) {
        name = name.replace(/[%+]/g, '');
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};