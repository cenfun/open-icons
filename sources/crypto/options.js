module.exports = {
    name: 'cryptocurrency-icons',
    url: 'https://github.com/spothq/cryptocurrency-icons',
    dirs: 'svg/color',

    onSVGName: function(name, item) {
        name = name.replace('$', '');
        return this.onSVGNameDefault(name, item);
    }

};
