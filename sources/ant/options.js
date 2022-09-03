module.exports = {
    name: '@ant-design/icons-svg',
    url: 'https://github.com/ant-design/ant-design-icons',
    dirs: ['inline-svg/filled', {
        outline: 'inline-svg/outlined'
    }],

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },

    readme: 'Without two-tone icons'
};
