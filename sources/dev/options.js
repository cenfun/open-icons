module.exports = {
    name: 'devicons',
    url: 'https://github.com/vorillaz/devicons',
    dirs: '!SVG',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    },

    onSVGDocument: function($svg) {
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
