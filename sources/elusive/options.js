module.exports = {
    name: 'elusive-iconfont',
    url: 'https://github.com/dovy/elusive-iconfont',
    downloadUrl: 'https://github.com/dovy/elusive-iconfont/archive/refs/heads/master.zip',
    moduleEntry: 'elusive-iconfont-master',

    license: 'SIL',
    dirs: 'dev/icons-svg',

    onSVGContent: function(content, item) {
        content = content.split('fill:#000000').join('fill:currentColor');
        content = content.split('fill="#000"').join('fill="currentColor"');
        return content;
    },

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
    }

};
