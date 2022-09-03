const fs = require('fs');
const path = require('path');
const vm = require('vm');
const Helper = require('../../scripts/helper.js');

const executeCode = function(entryPath, filename) {

    const code = fs.readFileSync(path.resolve(entryPath, filename), {
        encoding: 'utf-8'
    });

    const contextObject = {
        require: function(moduleName) {
            //console.log(`moduleName: ${moduleName}`);
            if (moduleName === 'react') {
                return {
                    createElement: (tag, props, children) => {
                        return {
                            type: tag,
                            props: {
                                ... props,
                                children
                            }
                        };
                    }
                };
            }
            return executeCode(entryPath, moduleName);
        },
        exports: {},
        _interopRequireDefault: (v) => v
    };
    vm.createContext(contextObject);
    vm.runInContext(code, contextObject);

    return contextObject.exports;
};

module.exports = {
    name: 'antd-mobile-icons',
    url: 'https://github.com/awmleer/antd-mobile-icons',
    dirs: function(name, Util) {

        const dir = path.resolve(this.modulePath, 'svg');
        Util.rmSync(dir);
        fs.mkdirSync(dir);

        const entryPath = path.resolve(this.modulePath, 'cjs');

        const bundle = executeCode(entryPath, 'index.js');

        const keys = Object.keys(bundle);
        //console.log(keys);

        keys.forEach((k) => {
            // const excludes = [];
            // if (excludes.includes(k)) {
            //     return;
            // }

            const v = bundle[k];
            //console.log(v);

            const props = v({});
            //console.log(props);

            const svg = Helper.createSvgFromReact(props);
            //console.log(svg);

            fs.writeFileSync(path.resolve(dir, `${Helper.pascalToKebabCase(k)}.svg`), svg);

        });

        return dir;
    }
};
