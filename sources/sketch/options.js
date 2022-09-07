module.exports = {
    name: 'sketch-icons',
    url: 'https://github.com/garudatechnologydevelopers/Sketch-icons',

    moduleFilters: 'main',

    dirs: 'main',

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace(/_/g, '-');

        return this.onSVGNameDefault(name, item);
    },

    onSVGContent: function(content, item) {
        content = content.split('#2A2238').join('currentColor');
        content = content.split('#1D1D1D').join('currentColor');
        content = content.split('#000').join('currentColor');
        content = content.split('#181717').join('currentColor');
        return content;
    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
