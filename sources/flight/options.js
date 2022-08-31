module.exports = {
    name: '@hashicorp/flight-icons',
    url: 'https://github.com/hashicorp/design-system/',
    dirs: 'node_modules/@hashicorp/flight-icons/svg',
    exclude: ['*-16.svg'],

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.replace('-24', '');
        return this.onSVGNameDefault(name, item);
    }

};
