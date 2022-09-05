module.exports = {
    debug: true,
    name: 'dashicons',
    url: 'https://github.com/WordPress/dashicons',
    downloadUrl: 'https://github.com/WordPress/dashicons/archive/refs/heads/master.zip',
    moduleEntry: 'dashicons-master',

    decompress: {
        filter: (file) => {
            return file.path === 'dashicons-master/package.json' || file.path.startsWith('dashicons-master/svg-min');
        }
    },

    dirs: 'svg-min',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
