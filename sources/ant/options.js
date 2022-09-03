module.exports = {
    name: '@ant-design/icons-svg',
    url: 'https://github.com/ant-design/ant-design-icons',
    dirs: ['inline-svg/filled', {
        outline: 'inline-svg/outlined'
    }],

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    },

    readme: 'Without two-tone icons'
};
