module.exports = {
    name: '@toe-icons/icons',
    url: 'https://github.com/javisperez/toe-icons',

    moduleFilters: 'dist/svg',

    dirs: 'dist/svg',

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');
    }

};
