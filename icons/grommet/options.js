module.exports = {
    package: 'grommet-icons',
    url: 'https://github.com/FortAwesome/Font-Awesome',
    dirs: 'node_modules/grommet-icons/img',
    readme: '',
    license: 'Apache 2.0',
    onSVGDocument: function($svg) {
        let found = false;
        ['path', 'rect', 'circle', 'polygon', 'polyline', 'g'].forEach(k => {
            const $elem = $svg.find(k);
            const stroke = $elem.attr('stroke');
            if (stroke && stroke !== 'none') {
                $elem.attr('stroke', 'currentColor');

                if ($elem.attr('fill-rule') === 'evenodd') {
                    $elem.attr('fill', 'none');
                }

                found = true;
                return;
            }
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