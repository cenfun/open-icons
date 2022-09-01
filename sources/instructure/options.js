module.exports = {
    name: '@instructure/ui-icons',
    url: 'https://github.com/instructure/instructure-ui',
    dirs: {
        line: 'node_modules/@instructure/ui-icons/svg/Line',
        solid: 'node_modules/@instructure/ui-icons/svg/Solid'
    },

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }

};
