module.exports = {
    name: 'dripicons',
    url: 'https://github.com/amitjakhu/dripicons',
    downloadUrl: 'https://github.com/amitjakhu/dripicons/archive/refs/heads/master.zip',
    moduleEntry: 'dripicons-master',

    license: 'CC-BY-SA-4.0',

    moduleFilters: 'SVG',
    dirs: 'SVG',

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
    }

};
