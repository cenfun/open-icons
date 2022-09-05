module.exports = {
    name: '@carbon/icons',
    url: 'https://github.com/carbon-design-system/carbon',

    decompress: {
        filter: (file) => {
            return file.path === 'package/package.json' || file.path.startsWith('package/svg/32');
        }
    },

    dirs: 'svg/32',

    onSVGDocument: function($svg) {
        $svg.attr('fill', 'currentColor');
    },

    onSVGName: function(name, item) {
        //replace -- to -
        name = name.split(/-+/).join('-');
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    }

};
