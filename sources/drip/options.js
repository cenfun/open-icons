module.exports = {
    name: 'dripicons',
    url: 'https://github.com/amitjakhu/dripicons',
    downloadUrl: 'https://github.com/amitjakhu/dripicons/archive/refs/heads/master.zip',
    moduleEntry: 'dripicons-master',

    decompress: {
        filter: (file) => {
            return file.path === 'dripicons-master/package.json' || file.path.startsWith('dripicons-master/SVG');
        }
    },

    license: 'CC-BY-SA-4.0',
    dirs: 'SVG',

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
    }

};
