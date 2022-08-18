module.exports = {
    package: 'line-awesome',
    url: 'https://github.com/icons8/line-awesome',
    dirs: 'node_modules/line-awesome/svg',
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
    
};