module.exports = {
    name: 'subway',
    url: 'https://github.com/mariuszostrowski/subway',

    downloadUrl: 'https://github.com/mariuszostrowski/subway/archive/refs/heads/master.zip',
    moduleEntry: 'subway-master',
    moduleFilters: 'SVG',

    license: 'CC BY 4.0',
    dirs: 'SVG',

    onSVGName: function(name, item) {
        name = name.toLowerCase().trim();

        name = name.replace(/_/g, '-');

        name = name.replace('@', 'at');
        name = name.replace('+', 'plus');

        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
