module.exports = {
    name: '@hashicorp/flight-icons',
    url: 'https://github.com/hashicorp/design-system/',
    dirs: 'svg',
    exclude: ['*-16.svg', '*-color-24.svg'],

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.replace('-24', '');
        return this.onSVGNameDefault(name, item);
    }

};
