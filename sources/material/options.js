module.exports = {
    name: '@material-design-icons/svg',
    url: 'https://github.com/marella/material-design-icons',
    dirs: ['filled', {
        outline: 'outlined'
    }],

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },

    readme: 'Without sharp/round/two-tone icons'
};
