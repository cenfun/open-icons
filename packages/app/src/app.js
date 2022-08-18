import './app.scss';

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
        const value = $(`.wci-icon-${key}`).value;
        sessionStorage.setItem(`wci-icon-${key}`, value);
        option[key] = value;
    });
    return option;
};

const setOption = function() {
    iconAttrs.forEach(function(key) {
        const value = sessionStorage.getItem(`wci-icon-${key}`);
        if (value) {
            $(`.wci-icon-${key}`).value = value;
        }
    });
};

setOption();

const savePNG = function(content, name) {
    content = content.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;
    let minifier;
    console.log(minifier);

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
    //add xmlns
    content = content.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
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
    grid = new Grid($('.wci-grid'));
    grid.bind('onClick', function(e, d) {
        const rowItem = d.rowItem;
        const $target = d.e.target;
        if ($target.tagName === 'TEXTAREA') {
            $target.select();
            return;
        }
        if ($target.classList.contains('wci-icon-copy')) {
            const url = `https://cenfun.github.io/wci/js/${rowItem.tag}.js`;
            const textarea = document.createElement('textarea');
            textarea.innerHTML = `&lt;script src=&quot;${url}&quot;&gt;&lt;/script&gt;\n${$target.innerHTML}`;
            copyContent(textarea.value);
            return;
        }
        if ($target.classList.contains('wci-icon-download')) {
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

const renderFinder = function(option, list, rows) {

    initGrid();

    const total = rows.length;

    $('.wci-info').innerHTML = `
        <div class="wci-title">Web Components Icons</div>
        <div class="wci-stats">Total <b>${list.length}</b> packages and <b>${total.toLocaleString()}</b> icons</div>
    `;

    const cellSize = parseInt(option.size) + 10;

    grid.setOption({
        rowHeight: cellSize,
        frozenColumn: 2,
        bindWindowResize: true,
        bindContainerResize: true,
        rowNotFound: '<div class="wci-not-found">Not found results</div>',
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
            return `<wci-ant class="wci-icon-action wci-icon-copy" name="copy-outlined" size="16px" title="copy script/wci">${this.getFormatter('icon')(v, r)}</wci-ant>`;
        },
        textarea: function(v, r, c) {
            if (c.id === 'svg') {
                return `<textarea spellcheck="false">${v}</textarea>`;
            }
            if (c.id === 'dataUrl') {
                const content = r.svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
                const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;
                return `<textarea spellcheck="false">${dataUrl}</textarea>`;
            }
            return `<textarea spellcheck="false">${this.getFormatter('icon')(v, r)}</textarea>`;
        },
        downloadSvg: function(v) {
            return '<wci-carbon class="wci-icon-action wci-icon-download" name="svg" size="16px" title="download svg file"></wci-carbon>';
        },
        downloadPng: function(v) {
            return '<wci-carbon class="wci-icon-action wci-icon-download" name="png" size="16px" title="download png file"></wci-carbon>';
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
            classMap: 'wci-icon',
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
            classMap: 'wci-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 1000
        }, {
            id: 'dataUrl',
            name: 'Data URL',
            classMap: 'wci-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 1000
        }, {
            id: 'wc',
            name: 'Web component',
            classMap: 'wci-textarea',
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
        $div.className = 'wci-icon-item';
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
            $name.className = 'wci-icon-item-label';
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


const renderPackage = function(option, item) {
    console.log(item);

    const bundle = `<a href="js/${item.tagName}.js" target="_blank">${item.tagName}.js</a>`;

    $('.wci-info').innerHTML = `
        <div class="wci-title">${item.name}</div>
        <div class="wci-link"><a href="${item.url}" target="_blank">${item.package}@${item.version} - ${item.license}</a></div>
        <div class="wci-stats">bundle: ${bundle} / <b>${item.total}</b> icons / size: ${item.size} / gzip: ${item.gzip}</div>
    `;

    const $container = $('.wci-package');
    $container.innerHTML = '';

    const list = item.icons;
    list.sort(function(a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });

    option.tagName = item.tagName;
    option.pageSize = 500;
    option.index = 0;

    renderList($container, list, option);

};

const renderView = function(list, gridRows) {

    const hash = location.hash.substr(1);
    //console.log(hash);
    const $package = $('.wci-package');
    const $finder = $('.wci-finder');

    $package.style.display = 'none';
    $finder.style.display = 'none';


    const option = getOption();


    if (hash) {
        const item = list.find((it) => it.name === hash);
        if (item) {
            $package.style.display = 'block';
            renderPackage(option, item);
            return;
        }
    }

    $finder.style.display = 'flex';
    renderFinder(option, list, gridRows);

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

let menuGrid;
const renderMenu = function(metadata) {
    const turbogrid = window.turbogrid;
    if (!turbogrid) {
        return;
    }

    if (menuGrid) {
        return;
    }

    const Grid = window.turbogrid.Grid;

    const rows = metadata.list.map((it) => {
        return {
            name: it.name,
            total: it.total.toLocaleString()
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
            dataType: 'number'
        }],
        rows
    };


    menuGrid = new Grid($('.wci-menu-grid'));

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

    const date = new Date(metadata.timestamp).toLocaleDateString();
    const footer = `<a href="https://github.com/cenfun/wci" target="_blank">Latest: v${metadata.version} - ${date}</a>`;
    $('.wci-menu-footer').innerHTML = footer;

};

const renderStart = function(metadata) {
    const list = metadata.list;
    const gridRows = [];
    list.forEach(function(item) {
        item.icons.forEach((ic) => {

            const iconName = ic.name;
            addPopular(iconName);

            gridRows.push({
                tag: item.tagName,
                name: iconName,
                package: item.name,
                svg: ic.svg
            });
        });
    });

    const popularList = initPopular();
    const picked = popularList[Math.floor(popularList.length * Math.random())];
    keywords = [picked];

    const $keywords = $('.wci-keywords');
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

    const $popular = $('.wci-popular');
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
        renderView(list, gridRows);
    });

    $('.wci-package').addEventListener('click', function(e) {
        const $elem = e.target;
        if ($elem.tagName.includes('-')) {
            saveSVG($elem.svg, $elem.parentNode.title);
        }
    });

    const toolbars = ['.wci-icon-size', '.wci-icon-color', '.wci-icon-background', '.wci-icon-radius'];
    toolbars.forEach(function(item) {
        const $item = $(item);
        $item.addEventListener('change', function(e) {
            renderView(list, gridRows);
        });
    });

    renderView(list, gridRows);
};

const initMetadata = function(metadata) {
    metadata.list.forEach(function(item) {
        const lib = window[`wci-${item.name}`];
        if (!lib) {
            return;
        }
        item.tagName = lib.tagName;
        item.icons = lib.icons;
    });
};

const getIconElement = function(icons) {
    class IconElement extends HTMLElement {

        static get observedAttributes() {
            return ['name', 'size', 'color', 'radius', 'background'];
        }

        constructor() {
            super();
            const shadow = this.attachShadow({
                mode: 'open'
            });
            this.$style = document.createElement('style');
            shadow.appendChild(this.$style);

            this.$container = document.createElement('div');
            shadow.appendChild(this.$container);
        }

        connectedCallback() {
            this.render();
        }

        attributeChangedCallback(name, oldValue, newValue) {
            this.render();
        }

        getIcon(name, key) {
            if (!name) {
                return '';
            }
            let item;
            for (let i = 0, l = icons.length; i < l; i++) {
                const it = icons[i];
                if (name === it.name || name === `${it.namespace}-${it.name}`) {
                    item = it;
                    break;
                }
            }
            if (!item) {
                return '';
            }
            if (key) {
                return item[key];
            }
            return item;
        }

        render() {

            const name = this.getAttribute('name') || 'blank';
            const size = this.getAttribute('size') || '100%';

            const color = this.getAttribute('color');
            let $color = '';
            if (color) {
                $color = `color: ${color};`;
            }

            const background = this.getAttribute('background');
            let $background = '';
            if (background) {
                $background = `background: ${background};`;
            }

            let $overflow = '';
            const radius = this.getAttribute('radius');
            let $radius = '';
            if (radius) {
                $radius = `border-radius: ${radius};`;
                $overflow = 'overflow: hidden;';
            }

            this.svg = this.getIcon(name, 'svg');

            this.$style.textContent = `
            :host, svg {
                display: block;
            }
            div {
                width: ${size};
                height: ${size};
                ${$color}
                ${$background}
                ${$radius}
                ${$overflow}
            }
        `;

            this.$container.innerHTML = this.svg;

        }
    }

    return IconElement;
};

const initIconElement = function(metadata) {
    metadata.list.forEach(function(item) {
        const IconElement = getIconElement(item.icons);
        const tagName = item.tagName;
        //override tagName
        IconElement.tagName = tagName;
        //define custom element
        if (customElements.get(tagName)) {
            console.error(`${tagName} already defined`);
        } else {
            //console.log(tagName);
            customElements.define(tagName, IconElement);
        }
    });
};

const loadLibs = async () => {

    const metadata = window.wciMetadata;
    console.log(metadata);

    const $loading = $('.wci-loading');
    const $loadingLabel = $loading.querySelector('.wci-loading-label');

    const { openStore } = window['open-store'];
    const ost = await openStore('wci');
    //console.log(db);
    const cache = await ost.get('metadata');
    //console.log(cache);
    if (cache && cache.version === metadata.version) {
        console.log('Found local cache', cache);
        $loading.style.display = 'none';
        initIconElement(cache);
        renderMenu(cache);
        renderStart(cache);
        return;
    }

    const libs = metadata.libs;
    const total = libs.length;

    let loaded = 0;
    const loadHandler = function(item) {
        loaded += 1;
        const per = Math.round(loaded / total * 100);
        $loadingLabel.innerHTML = `${item} ... ${per}% loaded`;
        renderMenu(metadata);
        if (loaded >= total) {
            $loading.style.display = 'none';
            initMetadata(metadata);
            ost.set('metadata', metadata);
            renderStart(metadata);
        }
    };

    libs.forEach(function(item, i) {
        const $script = document.createElement('script');
        $script.src = `js/${item}`;
        $script.addEventListener('load', function() {
            loadHandler(item);
        });
        document.body.appendChild($script);
    });

};


export default {
    createComponent: () => {
        loadLibs();
    }
};
