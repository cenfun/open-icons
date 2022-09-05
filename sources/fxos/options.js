module.exports = {
    name: 'fxos-icons',
    url: 'https://github.com/fxos-components/fxos-icons',
    downloadUrl: 'https://github.com/fxos-components/fxos-icons/archive/refs/heads/master.zip',
    moduleEntry: 'fxos-icons-master',

    dirs: 'images',

    onSVGContent: function(content) {

        content = content.split('fill="#000000"').join('fill="currentColor"');
        content = content.split('fill="#040000"').join('fill="currentColor"');
        content = content.split('fill: #848484').join('fill: currentColor');

        return content;
    },

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
