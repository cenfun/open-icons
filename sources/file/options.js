const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'svg-file-icons',
    url: 'https://github.com/file-icons/icons',
    dirs: function(name, Util) {

        const dir = path.resolve(this.modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const bundle = require(path.resolve(this.modulePath, 'build/svg-file-icons.json'));

        bundle.icons.forEach((icon) => {
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
