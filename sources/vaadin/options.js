const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const Helper = require('../../scripts/helper.js');

module.exports = {
    name: '@vaadin/icons',
    url: 'https://github.com/vaadin/web-components',
    dirs: function(Util, modulePath) {

        const dir = path.resolve(modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const jsPath = path.resolve(modulePath, 'vaadin-iconset.js');
        let content = Util.readFileContentSync(jsPath);

        const tag = 'vaadin-iconset';

        const li = content.indexOf(`<${tag}`);
        content = content.substr(li);
        const ri = content.indexOf(`${tag}>`);
        content = content.substring(0, ri + tag.length + 1);
        //console.log(content);

        const $ = cheerio.load(content, {
            xmlMode: true
        });

        const $svg = $('svg');

        $svg.find('g').each((i, elem) => {
            const $g = $(elem);
            const id = $g.attr('id');
            const k = id.split(':').pop();
            //console.log(name);
            const svg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <g fill="currentColor">${$g.html()}</g>
                </svg>
            `;
            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    }
};
