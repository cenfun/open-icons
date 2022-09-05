
module.exports = {
    name: 'academicons',
    url: 'https://github.com/jpswalsh/academicons',

    decompress: {
        filter: (file) => {
            return file.path === 'package/package.json' || file.path.startsWith('package/svg');
        }
    },

    dirs: 'svg',

    onSVGDocument: function($svg, item) {
        $svg.attr('fill', 'currentColor');

        if (['open-access', 'pubpeer'].includes(item.name)) {
            $svg.find('path').removeAttr('style');
        }

    }

};
