module.exports = {
    name: '@instructure/ui-icons',
    url: 'https://github.com/instructure/instructure-ui',
    dirs: ['svg/Solid', {
        line: 'svg/Line'
    }],

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }

};
