module.exports = {
    name: 'zondicons',
    url: 'https://www.zondicons.com/',
    dirs: '',

    onSVGName: function(name, item) {
        name = name.split(' ').join('-');
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
        $svg.find('polygon').attr('fill', 'currentColor');
    }
};
