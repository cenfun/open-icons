module.exports = {
    package: 'foundation-icons',
    url: 'https://github.com/zurb/foundation-icon-fonts',
    dirs: 'node_modules/foundation-icons/svgs',
    readme: '',
    license: 'MIT',
    onSVGName: function(name, item) {
        name = name.replace('fi-', '');
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg) {
        let found = false;
        ['path', 'polygon', 'rect', 'circle'].forEach(k => {
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