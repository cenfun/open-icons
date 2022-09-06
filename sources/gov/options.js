module.exports = {
    name: 'govicons',
    url: 'https://github.com/540co/govicons',

    moduleFilters: 'raw-svg',

    dirs: 'raw-svg',

    onSVGContent: function(content, item) {

        [
            '#000',
            '#000000',

            '#010101',
            '#010002',


            '#030104',
            '#0d0d0d',

            '#161616',
            '#1e1e1e',

            '#252525',
            '#2a2a2a',
            '#2A2A2A'

        ].forEach((c) => {
            content = content.split(c).join('currentColor');
        });

        return content;
    },

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
