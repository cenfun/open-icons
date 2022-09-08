const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: 'pepicons',
    url: 'https://github.com/CyCraft/pepicons',

    moduleFilters: 'dist/index.cjs.js',

    moduleInit: function(Util, modulePath) {

        const dir = path.resolve(modulePath, 'svg');
        fs.mkdirSync(dir);

        const entryPath = path.resolve(modulePath, 'dist/index.cjs.js');

        const bundle = Helper.executeCode(entryPath, Helper.dependencies);

        const pop = bundle.pop;
        const keys = Object.keys(pop);
        //console.log(keys);

        keys.forEach((k) => {
            const svg = pop[k];
            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);
        });

    },

    license: 'CC-BY-4.0'

};
