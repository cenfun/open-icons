module.exports = {
    name: 'eva-icons',
    url: 'https://github.com/akveo/eva-icons',
    dirs: ['fill/svg', 'outline/svg'],

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
