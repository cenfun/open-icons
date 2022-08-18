module.exports = {
    package: '@ant-design/icons-svg',
    url: 'https://github.com/ant-design/ant-design-icons',
    dirs: {
        filled: 'node_modules/@ant-design/icons-svg/inline-svg/filled',
        outlined: 'node_modules/@ant-design/icons-svg/inline-svg/outlined'
    },
    readme: 'No two-tone icons',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    }
};