
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const EC = require('eight-colors');

const cheerio = require('cheerio');
const { renderToString } = require('react-dom/server');


const Helper = {

    hasOwn: function(obj, key) {
        return Object.prototype.hasOwnProperty.call(obj, key);
    },

    pascalToKebabCase: (text) => {
        return (`${text}`).trim()
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/\W/g, (m) => ((/[À-ž]/).test(m) ? m : '-'))
            .replace(/^-+|-+$/g, '')
            .replace(/-{2,}/g, '-')
            .toLowerCase();
    },

    renderReactIcon: (Icon, props = {}) => {
        const content = renderToString(Icon.render(props));
        const $ = cheerio.load(content, {
            xmlMode: true
        });
        const $svg = $('svg');
        const $parent = $svg.parent();
        if ($parent) {
            return $parent.html();
        }
        return content;
    },

    createSvgFromReact: function(parent) {

        if (!parent) {
            EC.logRed('[createSvgFromReact] invalid option');
            return;
        }

        // console.log(parent);

        const { type, props } = parent;

        if (!type || !props) {
            console.log(parent);
            EC.logRed('[createSvgFromReact] invalid type or props');
            return;
        }

        let tagName = type;
        if (typeof tagName === 'function') {
            tagName = tagName.name.toLowerCase();
        }

        const attrs = Object.keys(props).map(function(name) {
            if (name === 'children') {
                return '';
            }
            let v = props[name];
            if (!v) {
                return '';
            }

            if (name !== 'viewBox') {
                name = Helper.pascalToKebabCase(name);
            }

            if (name === 'style' && v && typeof v === 'object') {
                v = Object.keys(v).map((k) => {
                    return `${k}:${v[k]};`;
                }).join('');
            }

            return `${name}="${v}"`;

        }).filter((it) => it).join(' ');

        let subs = '';
        let children = props.children;
        if (children) {
            if (!Array.isArray(children)) {
                children = [children];
            }
            subs = children.map((it) => {
                return Helper.createSvgFromReact(it);
            }).join('');
        }

        return `<${tagName} ${attrs}>${subs}</${tagName}>`;

    },

    cut: function(str, leftMatch, rightMatch) {

        if (typeof str !== 'string') {
            str = String(str);
        }

        const leftIndex = str.indexOf(leftMatch);
        if (leftIndex === -1) {
            EC.logRed(`Not found left match: ${leftMatch}`);
            return '';
        }
        str = str.slice(leftIndex);

        const rightIndex = str.lastIndexOf(rightMatch);
        if (rightIndex === -1) {
            EC.logRed(`Not found right match: ${rightMatch}`);
            return '';
        }
        str = str.slice(0, rightIndex + rightMatch.length);

        return str;
    },

    executeCode: function(entryPath, dependencies) {

        if (!fs.existsSync(entryPath)) {
            entryPath = `${entryPath}.js`;
            if (!fs.existsSync(entryPath)) {
                EC.logRed(`Not found module: ${entryPath}`);
                return;
            }
        }

        const stat = fs.statSync(entryPath);
        if (stat.isDirectory()) {
            entryPath = path.resolve(entryPath, 'index.js');
        }

        const code = fs.readFileSync(entryPath, {
            encoding: 'utf-8'
        });

        const moduleExports = {};

        const contextObject = {
            require: function(moduleName) {

                if (Helper.hasOwn(dependencies, moduleName)) {
                    return dependencies[moduleName];
                }

                const dir = path.dirname(entryPath);
                const childPath = path.resolve(dir, moduleName);
                return Helper.executeCode(childPath, dependencies);
            },
            module: {
                exports: moduleExports
            },
            exports: moduleExports,
            process: {
                env: {
                    NODE_ENV: ''
                }
            }
        };
        vm.createContext(contextObject);
        vm.runInContext(code, contextObject);

        return moduleExports;
    },

    dependencies: {
        'react': {
            createElement: (tag, props, ... children) => {
                return {
                    type: tag,
                    props: {
                        ... props,
                        children
                    }
                };
            },
            forwardRef: (render) => {
                return {
                    $$typeof: Symbol.for('react.forward_ref'),
                    render
                };
            }
        },
        'prop-types': {
            oneOfType: () => {}
        },
        'react/jsx-runtime': {
            jsx: (tag, props) => {
                return {
                    type: tag,
                    props: props
                };
            },
            jsxs: (tag, props) => {
                return {
                    type: tag,
                    props: props
                };
            }
        }
    }
};


module.exports = Helper;

