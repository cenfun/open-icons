module.exports = {
    name: 'simple-icons',
    url: 'https://github.com/simple-icons/simple-icons',
    dirs: 'icons',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },

    onSVGOptimized: function($svg, item, $) {

        const content = $svg.html();
        if (content.length > 5000) {
            //console.log(item.name, content.length);
            return false;
        }
    },

    readme: 'Without size bigger than 5000'


};
