module.exports = {
    package: 'zondicons',
    url: 'https://www.zondicons.com/',
    dirs: 'node_modules/zondicons',
    readme: '',
    license: 'CC BY 4.0',
    onSVGName: function(name, item) {
        name = name.split(' ').join('-');
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg) {
        $svg.find('path').attr('fill', 'currentColor');
        $svg.find('polygon').attr('fill', 'currentColor');
    }
};