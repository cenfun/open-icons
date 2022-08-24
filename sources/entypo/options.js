module.exports = {
    name: 'entypo',
    url: 'https://github.com/hypermodules/entypo',
    dirs: 'node_modules/entypo/src',
    onSVGName: function(name, item) {
        name = name.replace(/[%+]/g, '');
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
