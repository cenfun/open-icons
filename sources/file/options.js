const fs = require('fs');
const path = require('path');

module.exports = {
    debug: true,
    name: 'svg-file-icons',
    url: 'https://github.com/file-icons/icons',
    dirs: function(item, Util) {

        const dir = 'node_modules/svg-file-icons/svg';
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const json = require('svg-file-icons/build/svg-file-icons.json');
        //console.log(metadata.icons);

        json.icons.forEach((icon) => {
            const svg = `
                <svg viewBox="${icon.viewBox}">
                    ${icon.content}
                </svg>
            `;
            fs.writeFileSync(path.resolve(dir, `${icon.name}.svg`), svg);
        });

        return dir;
    }
};
