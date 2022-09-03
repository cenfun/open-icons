module.exports = {
    name: 'map-icons',
    url: 'https://github.com/scottdejonge/Map-Icons',
    dirs: 'src/icons',

    onSVGDocument: function($svg) {
        let found = false;
        ['g', 'path'].forEach((k) => {
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
