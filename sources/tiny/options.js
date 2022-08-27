module.exports = {
    name: 'super-tiny-icons',
    url: 'https://github.com/edent/SuperTinyIcons',
    dirs: 'node_modules/super-tiny-icons/images/svg',

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.split('_').join('-');
        return this.onSVGNameDefault(name, item);
    },
    onSVGDocument: function($svg, item, $) {
        //$svg.attr('fill', 'currentColor');
        if (item.name === 'tiktok') {

            const directive = $.root()[0].children.find((c) => c.type === 'directive');
            const d = directive.data.split('"')[1];
            console.log(`tiktok replacement: ${d}`);
            $.root().find('[d="&z;"]').attr('d', d);

        }
    }
};
