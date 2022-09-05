
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: 'geomicons-open',
    url: 'https://github.com/jxnblk/geomicons-open',
    dirs: 'dist/svg',

    onSVGName: function(name, item) {

        name = Helper.pascalToKebabCase(name);

        return this.onSVGNameDefault(name, item);
    }
};
