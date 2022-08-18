module.exports = {
    package: 'heroicons',
    url: 'https://github.com/tailwindlabs/heroicons',
    dirs: {
        outline: 'node_modules/heroicons/outline',
        solid: 'node_modules/heroicons/solid'
    },
    readme: '',
    license: 'MIT',
    onSVGName: function(name, item) {
        name = name.toLowerCase();
        return this.onSVGNameDefault(name, item);
    }
};