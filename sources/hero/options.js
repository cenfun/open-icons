module.exports = {
    name: 'heroicons',
    url: 'https://github.com/tailwindlabs/heroicons',
    dirs: {
        outline: 'node_modules/heroicons/outline',
        solid: 'node_modules/heroicons/solid'
    },

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    }
};
