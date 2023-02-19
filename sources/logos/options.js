module.exports = {
    name: 'logos',
    url: 'https://github.com/gilbarbara/logos',

    downloadUrl: 'https://github.com/gilbarbara/logos/archive/refs/heads/main.zip',
    moduleEntry: 'logos-main',
    moduleFilters: 'logos',

    license: 'CC0-1.0',

    dirs: 'logos',

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace(/_/g, '-');
        // name = Helper.pascalToKebabCase(name);

        return this.onSVGNameDefault(name, item);
    },

    onSVGOptimized: function($svg, item, $) {

        const content = $svg.html();
        if (content.length > 5000) {
            // console.log(item.name, content.length);
            return false;
        }
    },

    readme: 'Without size bigger than 5000'

};
