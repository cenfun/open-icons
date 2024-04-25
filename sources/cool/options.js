const fs = require('fs');
const path = require('path');
const SFE = require('svg-font-extractor');
module.exports = {
    name: 'coolicons',
    url: 'https://github.com/krystonschwarze/coolicons',

    downloadUrl: 'https://github.com/krystonschwarze/coolicons/archive/refs/heads/master.zip',
    moduleEntry: 'coolicons-master',

    moduleFilters: 'Webfont',

    license: 'CC 4.0',

    onSVGName: function(name, item) {
        name = name.toLowerCase();

        name = name.replace(/_/g, '-');

        return this.onSVGNameDefault(name, item);
    },

    moduleInit: function(modulePath, Util) {

        const output = path.resolve(modulePath, 'svg');

        SFE({
            input: path.resolve(modulePath, 'Webfont/fonts/coolicons.svg'),
            output
        });

        // remove 0.svg
        fs.rmSync(path.resolve(output, '0.svg'));

    }

};
