module.exports = {
    package: 'eva-icons',
    url: 'https://github.com/akveo/eva-icons',
    dirs: [
        'node_modules/eva-icons/fill/svg',
        'node_modules/eva-icons/outline/svg'
    ],
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};