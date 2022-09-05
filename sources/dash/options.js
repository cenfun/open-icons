module.exports = {
    name: 'dashicons',
    url: 'https://github.com/WordPress/dashicons',
    downloadUrl: 'https://github.com/WordPress/dashicons/archive/refs/heads/master.zip',
    moduleEntry: 'dashicons-master',

    moduleFilters: 'svg-min',
    dirs: 'svg-min',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    }
};
