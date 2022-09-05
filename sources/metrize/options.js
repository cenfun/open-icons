module.exports = {
    name: 'metrize-icons',
    url: 'https://www.alessioatzeni.com/metrize-icons/',
    downloadUrl: 'https://www.alessioatzeni.com/wp-content/themes/az/_include/metrize/custom/metrize-icons/download/Metrize_Icons.zip',
    moduleEntry: 'Metrize_Icons',

    decompress: {
        filter: (file) => {
            return file.path === 'Metrize_Icons/package.json' || file.path.startsWith('Metrize_Icons/SVG');
        }
    },

    license: 'Free',
    dirs: 'SVG',

    onSVGDocument: function($svg, item, $) {
        $svg.attr('fill', 'currentColor');
        if (item.name === 'search') {
            $svg.find('path').attr('fill', 'currentColor');
        }
    }

};
