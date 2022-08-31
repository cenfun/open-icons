module.exports = {
    name: 'evil-icons',
    url: 'https://github.com/evil-icons/evil-icons',
    dirs: 'node_modules/evil-icons/assets/icons',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.replace('ei-sc-', '');
        name = name.replace('ei-', '');
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
