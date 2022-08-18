module.exports = {
    package: '@uiw/icons',
    url: 'https://github.com/uiwjs/icons',
    dirs: 'node_modules/@uiw/icons/icon',
    readme: '',
    license: 'MIT',
    onSVGDocument: function($svg) {
        let found = false;
        ['path', 'use'].forEach(k => {
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