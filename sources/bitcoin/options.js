module.exports = {
    name: '@bitcoin-design/bitcoin-icons',
    url: 'https://github.com/BitcoinDesign/Bitcoin-Icons',

    moduleFilters: 'svg',

    dirs: ['svg/filled', {
        outline: 'svg/outline'
    }],

    onSVGName: function(name, item) {
        name = name.toLowerCase();
        name = name.replace(/\s+/g, '-');
        return this.onSVGNameDefault(name, item);
    },

    onSVGContent: function(content, item) {
        content = content.split('black').join('currentColor');
        return content;
    }

};
