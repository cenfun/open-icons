module.exports = {
    name: 'coolicons',
    url: 'https://github.com/krystonschwarze/coolicons',

    downloadUrl: 'https://github.com/krystonschwarze/coolicons/archive/refs/heads/master.zip',
    moduleEntry: 'coolicons-master',

    moduleFilters: 'coolicons SVG',

    license: 'CC 4.0',

    dirs: 'coolicons SVG',

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace(/_/g, '-');

        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg, item) {
        let found = false;
        ['path'].forEach((k) => {
            const $elem = $svg.find(k);
            const fill = $elem.attr('fill');
            if (fill && fill !== 'none') {
                $elem.attr('fill', 'currentColor');
                found = true;
            }
        });
        if (found) {
            return;
        }
        $svg.attr('fill', 'currentColor');
    }

};
