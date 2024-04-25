module.exports = {
    name: '@toe-icons/icons',
    url: 'https://github.com/javisperez/toe-icons',

    moduleFilters: 'dist/svg',

    dirs: 'dist/svg',

    onSVGDocument: function($svg) {
        let found = false;
        ['path'].forEach((k) => {
            const $elem = $svg.find(k);
            const fill = $elem.attr('fill');
            if (fill && fill !== 'none') {
                $elem.attr('fill', 'currentColor');
                found = true;
            }

            const stroke = $elem.attr('stroke');
            if (stroke && stroke !== 'none') {
                $elem.attr('stroke', 'currentColor');
                found = true;
            }

        });
        if (found) {
            return;
        }
        $svg.attr('fill', 'currentColor');
    }

};
