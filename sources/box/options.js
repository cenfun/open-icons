module.exports = {
    name: 'boxicons',
    url: 'https://github.com/atisawd/boxicons',
    dirs: 'node_modules/boxicons/svg',

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace('bx-', '');

        if (name.startsWith('bxl-')) {
            name = name.replace('bxl-', '');
            name += '-logo';
        }

        if (name.startsWith('bxs-')) {
            name = name.replace('bxs-', '');
            name += '-solid';
        }

        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('viewBox', '0 0 24 24');
        $svg.attr('fill', 'currentColor');
    },

    readme: '',
    license: 'MIT'
};
