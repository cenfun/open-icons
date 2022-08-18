module.exports = {
    package: 'jam-icons',
    url: 'https://github.com/michaelampr/jam',
    dirs: 'node_modules/jam-icons/svg',
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
    
};