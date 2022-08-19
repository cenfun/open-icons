import './app.scss';

import {
    loadPackages, getIconElement, version, timestamp
} from 'web-icons';

const $ = function(selector) {
    return document.querySelector(selector);
};

const copyContent = function(content) {
    navigator.clipboard.writeText(content);
};

const iconAttrs = ['size', 'color', 'background', 'radius'];
const getOption = function() {
    const option = {};
    iconAttrs.forEach(function(key) {
        const value = $(`.wi-icon-${key}`).value;
        sessionStorage.setItem(`wi-icon-${key}`, value);
        option[key] = value;
    });
    return option;
};

const setOption = function() {
    iconAttrs.forEach(function(key) {
        const value = sessionStorage.getItem(`wi-icon-${key}`);
        if (value) {
            $(`.wi-icon-${key}`).value = value;
        }
    });
};

setOption();

const savePNG = function(content, name) {
    const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;

    const option = getOption();
    const size = parseInt(option.size);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.cssText = 'position:absolute;top:0;right:0;';
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    const img = document.createElement('img');
    img.width = size;
    img.height = size;
    img.src = dataUrl;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        document.body.removeChild(img);
        canvas.toBlob(function(blob) {
            window.saveAs(blob, `${name}.png`);
            document.body.removeChild(canvas);
        });
    };
    document.body.appendChild(img);

};

const saveSVG = function(content, name) {
    const blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
    });
    window.saveAs(blob, `${name}.svg`);
};


const getColor = function(c, colorIndex) {
    const colors = [
        'orangered',
        'orange',
        'green',
        'deepskyblue',
        'royalblue',
        'darkorchid'
    ];

    if (c === 'rainbow') {
        const index = colorIndex % colors.length;
        c = colors[index];
        colorIndex += 1;
    }

    return c;
};

const getIcon = function(r, size, color, background, radius) {
    const c = getColor(color, r.tg_index);
    return `<${r.tag} name="${r.name}" size="${size}" color="${c}" background="${background}" radius="${radius}"></${r.tag}>`;
};


let grid;
let keywords = [];

const initGrid = function() {
    if (grid) {
        return;
    }

    const Grid = window.turbogrid.Grid;
    grid = new Grid($('.wi-grid'));
    grid.bind('onClick', function(e, d) {
        const rowItem = d.rowItem;
        const $target = d.e.target;
        if ($target.tagName === 'TEXTAREA') {
            $target.select();
            return;
        }
        if ($target.classList.contains('wi-icon-copy')) {
            const url = `https://cenfun.github.io/wi/js/${rowItem.tag}.js`;
            const textarea = document.createElement('textarea');
            textarea.innerHTML = `&lt;script src=&quot;${url}&quot;&gt;&lt;/script&gt;\n${$target.innerHTML}`;
            copyContent(textarea.value);
            return;
        }
        if ($target.classList.contains('wi-icon-download')) {
            const type = $target.getAttribute('name');
            if (type === 'png') {
                savePNG(rowItem.svg, rowItem.name);
                return;
            }
            saveSVG(rowItem.svg, rowItem.name);
        }
    });
    grid.showLoading();
};

const renderFinder = function(option, packages, rows) {

    initGrid();

    const total = rows.length;

    $('.wi-info').innerHTML = `
        <div class="wi-title">Web Components Icons</div>
        <div class="wi-stats">Total <b>${packages.length}</b> packages and <b>${total.toLocaleString()}</b> icons</div>
    `;

    const cellSize = parseInt(option.size) + 10;

    grid.setOption({
        rowHeight: cellSize,
        frozenColumn: 2,
        bindWindowResize: true,
        bindContainerResize: true,
        rowNotFound: '<div class="wi-not-found">Not found results</div>',
        rowFilter: function(rowData) {
            if (!keywords.length) {
                return true;
            }
            const iconName = rowData.name;
            const parts = iconName.split('-');
            for (let i = 0; i < keywords.length; i++) {
                const keyword = keywords[i];
                if (parts.includes(keyword) || iconName.startsWith(keyword)) {
                    return true;
                }
            }
            return false;
        }
    });
    grid.setFormatter({
        index: function(v, r) {
            return r.tg_index + 1;
        },
        icon: function(v, r) {
            return getIcon(r, option.size, option.color, option.background, option.radius);
        },
        package: function(v, r) {
            return `<a href="#${v}">${v}</a>`;
        },
        copy: function(v, r) {
            return `<wi-ant class="wi-icon-action wi-icon-copy" name="copy-outlined" size="16px" title="copy script/wi">${this.getFormatter('icon')(v, r)}</wi-ant>`;
        },
        textarea: function(v, r, c) {
            if (c.id === 'svg') {
                return `<textarea spellcheck="false">${v}</textarea>`;
            }
            if (c.id === 'dataUrl') {
                const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(r.svg)}`;
                return `<textarea spellcheck="false">${dataUrl}</textarea>`;
            }
            return `<textarea spellcheck="false">${this.getFormatter('icon')(v, r)}</textarea>`;
        },
        downloadSvg: function(v) {
            return '<wi-carbon class="wi-icon-action wi-icon-download" name="svg" size="16px" title="download svg file"></wi-carbon>';
        },
        downloadPng: function(v) {
            return '<wi-carbon class="wi-icon-action wi-icon-download" name="png" size="16px" title="download png file"></wi-carbon>';
        }
    });
    grid.setData({
        columns: [{
            id: 'index',
            name: '',
            align: 'center',
            width: 55,
            sortable: false,
            formatter: 'index'
        }, {
            id: 'icon',
            name: '',
            width: cellSize,
            minWidth: cellSize,
            align: 'center',
            classMap: 'wi-icon',
            formatter: 'icon',
            sortable: false
        }, {
            id: 'name',
            name: 'Name',
            width: 150
        }, {
            id: 'downloadSvg',
            name: '',
            align: 'center',
            formatter: 'downloadSvg',
            resizable: false,
            width: 30
        }, {
            id: 'downloadPng',
            name: '',
            align: 'center',
            formatter: 'downloadPng',
            resizable: false,
            width: 30
        }, {
            id: 'svg',
            name: 'Pure SVG',
            classMap: 'wi-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 1000
        }, {
            id: 'dataUrl',
            name: 'Data URL',
            classMap: 'wi-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 1000
        }, {
            id: 'wc',
            name: 'Web component',
            classMap: 'wi-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 500
        }, {
            id: 'package',
            name: 'Package',
            align: 'center',
            formatter: 'package'
        }, {
            id: 'copy',
            name: '',
            align: 'center',
            formatter: 'copy',
            sortable: false,
            width: 50
        }],
        rows
    });
    grid.render();
    grid.hideLoading();
};

const renderList = function($container, list, option) {

    const next = [];

    list.forEach(function(item, i) {

        if (i > option.pageSize) {
            next.push(item);
            return;
        }

        const $div = document.createElement('div');
        $div.className = 'wi-icon-item';
        $div.title = item.name;

        const $icon = document.createElement(option.tagName);
        $icon.setAttribute('name', item.name);
        $icon.setAttribute('size', option.size);
        if (option.color) {
            const color = getColor(option.color, option.index);
            $icon.setAttribute('color', color);
        }
        if (option.background) {
            $icon.setAttribute('background', option.background);
        }
        if (option.radius) {
            $icon.setAttribute('radius', option.radius);
        }
        $div.appendChild($icon);

        if (parseInt(option.size) >= 64) {
            const $name = document.createElement('div');
            $name.className = 'wi-icon-item-label';
            $name.style.width = option.size;
            $name.innerText = item.name;
            $div.appendChild($name);
        }

        $container.appendChild($div);

        option.index += 1;

    });

    if (next.length) {
        setTimeout(function() {
            renderList($container, next, option);
        });
    }
};


const renderPackage = function(option, pkg) {
    console.log(pkg);

    const bundle = `<a href="dist/${pkg.namespace}.js" target="_blank">${pkg.namespace}.js</a>`;

    const source = pkg.source;
    const total = pkg.icons.length.toLocaleString();

    $('.wi-info').innerHTML = `
        <div class="wi-title">${pkg.name}</div>
        <div class="wi-link"><a href="${source.url}" target="_blank">${source.name}@${source.version} - ${source.license}</a></div>
        <div class="wi-stats">bundle: ${bundle} / <b>${total}</b> icons / size: ${pkg.size} / gzip: ${pkg.sizeGzip}</div>
    `;

    const $container = $('.wi-package');
    $container.innerHTML = '';

    const list = pkg.icons;
    list.sort(function(a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });

    option.tagName = pkg.tagName;
    option.pageSize = 500;
    option.index = 0;

    renderList($container, list, option);

};

const renderView = function(packages, gridRows) {

    const hash = location.hash.substr(1);
    //console.log(hash);
    const $package = $('.wi-package');
    const $finder = $('.wi-finder');

    $package.style.display = 'none';
    $finder.style.display = 'none';


    const option = getOption();


    if (hash) {
        const item = packages.find((pkg) => pkg.name === hash);
        if (item) {
            $package.style.display = 'block';
            renderPackage(option, item);
            return;
        }
    }

    $finder.style.display = 'flex';
    renderFinder(option, packages, gridRows);

};

const popularMap = {};
const addPopular = function(n) {
    n.split('-').forEach((w) => {
        if (w.length < 2) {
            return;
        }
        if (popularMap[w]) {
            popularMap[w] += 1;
        } else {
            popularMap[w] = 1;
        }
    });
};

const initPopular = function() {
    const popularList = [];
    Object.keys(popularMap).map((k) => {
        const num = popularMap[k];
        if (num > 10) {
            popularList.push(k);
        }
    });
    return popularList;
};

const getPopular = function(popularList) {
    //console.log(popularList);

    const list = [];
    let num = 10;
    while (num > 0) {
        const item = popularList[Math.floor(popularList.length * Math.random())];
        if (!list.includes(item)) {
            list.push(item);
            num -= 1;
        }
    }

    const ks = list.map((item) => {
        return `<span>${item}</span>`;
    });

    return `Popular: ${ks} <i></i>`;
};

const renderMenu = function(packages) {

    const Grid = window.turbogrid.Grid;

    const rows = packages.map((pkg) => {
        return {
            name: pkg.name,
            total: pkg.icons.length.toLocaleString()
        };
    });

    rows.unshift({
        name: 'Icon Finder',
        total: '',
        hash: 'finder',
        type: 'finder',
        selectable: true
    });

    const menuData = {
        columns: [{
            id: 'name',
            name: 'Name',
            width: 98
        }, {
            id: 'total',
            name: 'Total',
            width: 60,
            type: 'number'
        }],
        rows
    };


    const menuGrid = new Grid($('.wi-menu-grid'));

    menuGrid.bind('onClick', function(e, d) {
        if (!d.rowNode) {
            return;
        }
        const rowItem = d.rowItem;
        document.location.hash = rowItem.hash || rowItem.name;
        menuGrid.setRowSelected(rowItem, d.e);
    });

    menuGrid.setFormatter({
        rowNumber: function(value, rowItem, columnItem, cellNode) {
            const defaultFormatter = this.getDefaultFormatter('rowNumber');
            if (rowItem.type === 'finder') {
                return '<svg pointer-events="none" width="100%" height="100%" viewBox="0 0 24 24"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor"><path d="M0 0h24v24H0z" stroke="none"/><circle cx="10" cy="10" r="7"/><path d="m21 21-6-6"/></g></svg>';
            }
            return defaultFormatter(value, rowItem, columnItem, cellNode);
        }
    });

    menuGrid.setOption({
        theme: 'dark',
        headerVisible: false,
        frozenRow: 0,
        frozenRowHoverable: true,
        selectMultiple: false,
        rowNumberVisible: true,
        rowNumberWidth: 30,
        bindWindowResize: true,
        bindContainerResize: true
    });

    menuGrid.setData(menuData);
    menuGrid.render();

    const date = new Date(timestamp).toLocaleDateString();
    const footer = `<a href="https://github.com/cenfun/wi" target="_blank">Latest: v${version} - ${date}</a>`;
    $('.wi-menu-footer').innerHTML = footer;

};

const renderStart = function(packages) {

    const gridRows = [];
    packages.forEach(function(pkg) {

        pkg.icons.forEach((ic) => {

            const iconName = ic.name;
            addPopular(iconName);

            gridRows.push({
                tag: pkg.tagName,
                name: iconName,
                package: pkg.name,
                svg: ic.svg
            });
        });
    });

    const popularList = initPopular();
    const picked = popularList[Math.floor(popularList.length * Math.random())];
    keywords = [picked];

    const $keywords = $('.wi-keywords');
    $keywords.value = picked;
    $keywords.focus();

    const keywordsHandler = function() {
        const str = $keywords.value.trim();
        if (str) {
            keywords = str.split(/\s+/);
        } else {
            keywords = [];
        }
        //console.log(keywords);
        grid.update();
    };
    $keywords.addEventListener('input', function(e) {
        keywordsHandler();
    });

    const $popular = $('.wi-popular');
    $popular.addEventListener('click', function(e) {
        const tagName = e.target.tagName.toLowerCase();
        if (tagName === 'span') {
            $keywords.value = e.target.innerText;
            keywordsHandler();
            return;
        }

        if (tagName === 'i') {
            $popular.innerHTML = getPopular(popularList);
        }
    });
    $popular.innerHTML = getPopular(popularList);

    window.addEventListener('popstate', (e) => {
        renderView(packages, gridRows);
    });

    $('.wi-package').addEventListener('click', function(e) {
        const $elem = e.target;
        if ($elem.tagName.includes('-')) {
            saveSVG($elem.svg, $elem.parentNode.title);
        }
    });

    const toolbars = ['.wi-icon-size', '.wi-icon-color', '.wi-icon-background', '.wi-icon-radius'];
    toolbars.forEach(function(item) {
        const $item = $(item);
        $item.addEventListener('change', function(e) {
            renderView(packages, gridRows);
        });
    });

    renderView(packages, gridRows);
};

const initPackages = function(packages) {

    packages.forEach(function(pkg) {
        const IconElement = getIconElement(pkg.icons);
        //override tagName
        IconElement.tagName = pkg.tagName;
        //define custom element
        if (customElements.get(pkg.tagName)) {
            console.error(`${pkg.tagName} already defined`);
        } else {
            //console.log(tagName);
            customElements.define(pkg.tagName, IconElement);
        }
    });

    renderMenu(packages);

    renderStart(packages);
};

const loadLibs = async () => {

    const $loading = $('.wi-loading');
    const $loadingLabel = $loading.querySelector('.wi-loading-label');

    const { openStore } = window['open-store'];
    const ost = await openStore('wi');
    //console.log(db);
    const cache = await ost.get('metadata');
    //console.log(cache);
    if (cache && cache.version === version) {

        console.log('Found cache icons', cache);
        $loading.style.display = 'none';
        initPackages(cache.packages);

        return;
    }

    const packages = await loadPackages('../node_modules/web-icons/dist/', (item, info) => {
        //console.log(info);
        const per = Math.round(info.loadedSize / info.totalSize * 100);
        $loadingLabel.innerHTML = `loaded ${per}% (${info.loaded}/${info.total}) - ${item.name}`;
    });


    const metadata = {
        version,
        timestamp,
        packages
    };

    ost.set('metadata', metadata);

    console.log('Loaded icons', metadata);
    $loading.style.display = 'none';
    initPackages(metadata.packages);

};


export default {
    createComponent: () => {
        loadLibs();
    }
};
