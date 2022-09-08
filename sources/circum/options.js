const fs = require('fs');
const path = require('path');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@klarr-agency/circum-icons',
    url: 'https://github.com/Klarr-Agency/Circum-Icons',

    moduleFilters: 'src/iconList.js',

    dirs: function(Util, modulePath) {

        const dir = path.resolve(modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const entryPath = path.resolve(modulePath, 'src/iconList.js');
        const content = fs.readFileSync(entryPath, {
            encoding: 'utf-8'
        });

        const jsonStr = Helper.cut(content, '[', ';');

        const icons = new Function(`return ${jsonStr}`)();
        //console.log(icons);
        icons.forEach((item) => {

            const svg = `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${item.svg}</svg>`;

            const name = item.name.replace(/_/g, '-');

            fs.writeFileSync(path.resolve(dir, `${name}.svg`), svg);

        });

        return 'svg';
    }

};
