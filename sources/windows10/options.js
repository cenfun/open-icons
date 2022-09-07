module.exports = {
    name: 'windows-10-icons',
    url: 'https://github.com/icons8/windows-10-icons',

    moduleFilters: 'svg/production',

    dirs: 'svg/production',

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace(/_/g, '-');

        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
