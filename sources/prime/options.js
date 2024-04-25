module.exports = {
    name: 'primeicons',
    url: 'https://github.com/primefaces/primeicons',
    dirs: 'raw-svg',

    onSVGDocument: function($svg) {
        let found = false;
        ['circle', 'path'].forEach((k) => {
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
