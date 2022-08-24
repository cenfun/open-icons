<script setup>
import VineUI from 'vine-ui';
import {
    isRef,
    onMounted, provide, reactive, ref, shallowReactive, toRaw, watch
} from 'vue';
import openStore from 'open-store';
import { Grid } from 'turbogrid';
import {
    loadPackages, getIconElement, version, timestamp
} from 'open-icons';

import { BF } from './util/util.js';
import { initTooltip } from './util/tooltip.js';

import OiLoading from './components/loading.vue';
import OiSettings from './components/settings.vue';
import OiFinder from './components/finder.vue';
import OiMy from './components/my.vue';

const {
    VuiLayout, VuiFlex, VuiTab
} = VineUI;

const layout = ref('200px,auto');

const loading = shallowReactive({
    text: 'Loading Icons ...',
    detail: '(checking local cache)',
    percentage: 0,
    visible: true
});

provide('loading', loading);

const state = shallowReactive({
    ost: null,
    packages: null,
    packageName: null,
    total: null,
    icons: null,
    tabIndex: 0
});

provide('state', state);

const myIcons = reactive({
    icons: []
});

provide('myIcons', myIcons);

const defaultSettings = {
    size: '32px',
    color: 'rainbow',
    colorCustom: '',
    bg: '',
    bgCustom: '',
    radius: ''
};

const settings = shallowReactive(defaultSettings);

provide('settings', settings);

const renderPackages = function(packages) {

    const rows = packages.map((pkg) => {
        pkg.iconsNum = pkg.icons.length.toLocaleString();
        pkg.sourceFrom = `${pkg.source.name}@${pkg.source.version}`;
        pkg.sourceLicense = pkg.source.license;
        return pkg;
    });

    rows.unshift(state.total);

    const gridData = {
        columns: [{
            id: 'name',
            name: 'Name',
            width: 80
        }, {
            id: 'iconsNum',
            name: 'Icons',
            type: 'number',
            width: 60
        }, {
            id: 'size',
            name: 'Size',
            formatter: 'BF',
            align: 'right'
        }, {
            id: 'sizeGzip',
            name: 'Gzip',
            formatter: 'BF',
            align: 'right'
        }, {
            id: 'dist',
            name: 'Dist',
            formatter: 'dist',
            width: 160
        }, {
            id: 'sourceFrom',
            name: 'Source From',
            formatter: 'sourceFrom',
            width: 200
        }, {
            id: 'sourceLicense',
            name: 'License',
            width: 100
        }],
        rows
    };

    const grid = new Grid('.oi-packages-grid');

    grid.bind('onFirstUpdated', function(e) {
        //console.log(e.type);
        if (!state.packageName) {
            return;
        }
        const rowItem = this.getRowItemBy('name', state.packageName);
        if (rowItem) {
            this.setRowSelected(rowItem);
            this.scrollRowIntoView(rowItem);
        }
    });

    grid.bind('onClick', function(e, d) {
        if (!d.rowNode) {
            return;
        }
        const rowItem = d.rowItem;

        let packageName = rowItem.name;
        if (rowItem.type === 'total') {
            packageName = '';
        }
        state.packageName = packageName;
        document.location.hash = packageName;
        grid.setRowSelected(rowItem, d.e);
    });

    grid.setFormatter({

        rowNumber: function(value, rowItem, columnItem, cellNode) {
            const defaultFormatter = this.getDefaultFormatter('rowNumber');
            if (rowItem.type === 'total') {
                return '<div class="oi-icon-total"></div>';
            }
            return defaultFormatter(value, rowItem, columnItem, cellNode);
        },

        sourceFrom: function(value, rowItem, columnItem, cellNode) {
            const source = rowItem.source;
            if (!source) {
                return '—';
            }
            return `<a href="${source.url}" target="_blank">${value}</a>`;
        },

        dist: function(value, rowItem, columnItem, cellNode) {
            if (!rowItem.namespace) {
                return '—';
            }
            const bundleName = `${rowItem.namespace}.js`;
            return `<a href="/dist/${bundleName}" target="_blank">${bundleName}</a>`;
        },

        BF: function(value, rowItem, columnItem, cellNode) {
            return BF(value);
        }

    });

    grid.setOption({
        theme: 'dark',
        frozenRow: 0,
        frozenColumn: 0,
        frozenRowHoverable: true,
        selectMultiple: false,
        rowNumberVisible: true,
        rowNumberWidth: 30,
        scrollbarRound: true,
        bindWindowResize: true,
        bindContainerResize: true
    });

    grid.setData(gridData);
    grid.render();

};

const addTag = function(tags, n) {
    n.split('-').forEach((w) => {
        if (w.length < 2) {
            return;
        }
        if (tags[w]) {
            tags[w] += 1;
        } else {
            tags[w] = 1;
        }
    });
};

const getTags = function(tags) {
    const list = Object.keys(tags).map((k) => {
        return {
            name: k,
            num: tags[k]
        };
    });

    list.sort((a, b) => {
        return b.num - a.num;
    });

    const max = list[0].num;
    list.forEach((it) => {
        it.prob = Math.round(it.num / max * 100);
    });

    const ls = list.filter((it) => it.prob > 0);

    //console.log(ls.length);

    return ls;
};

const initPackages = function(packages) {

    let totalSize = 0;
    let totalGzip = 0;
    const allIcons = [];
    const allTags = {};

    packages.forEach(function(pkg) {

        totalSize += pkg.size;
        totalGzip += pkg.sizeGzip;

        const tags = {};

        pkg.icons.forEach((icon) => {
            const iconName = icon.name;
            addTag(allTags, iconName);
            addTag(tags, iconName);
            allIcons.push({
                name: iconName,
                namespace: icon.namespace,
                svg: icon.svg,
                packageName: pkg.name,
                tagName: pkg.tagName
            });
        });

        pkg.tags = getTags(tags);

        //init web components
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

    state.total = {
        name: 'Total',
        fullName: 'Open Icons',
        type: 'total',
        source: {
            name: 'open-icons',
            version: version,
            url: 'https://github.com/cenfun/open-icons',
            license: 'MIT'
        },
        namespace: 'open-icons',
        tags: getTags(allTags),
        icons: allIcons,
        iconsNum: allIcons.length.toLocaleString(),
        size: totalSize,
        sizeGzip: totalGzip,
        selectable: true
    };

    state.icons = allIcons;

    state.packages = packages;
    state.packageName = location.hash.substr(1);
    //console.log(state.packageName);

    renderPackages(packages);

};

const loadStart = async () => {

    const ost = await openStore('open-icons');
    state.ost = ost;

    await read('layout', layout);
    await read('settings', settings);
    await read('myIcons', myIcons);

    const path = window.WC_ICONS_PATH;

    console.log('wc icons path:', path);

    //console.log(db);
    const cache = await ost.get('metadata');
    //console.log(cache);
    if (cache && cache.version === version) {

        console.log('Found cache icons', cache);
        loading.visible = false;

        initPackages(cache.packages);

        return;
    }

    const packages = await loadPackages(path, (item, info) => {
        //console.log(info);
        const percentage = Math.round(info.loadedSize / info.totalSize * 100);
        loading.percentage = percentage;
        loading.text = `Loading ${info.loaded} / ${info.total} - ${item.name}`;
        loading.detail = `${BF(info.loadedSize)} / ${BF(info.totalSize)} - ${percentage}%`;
    });

    const metadata = {
        version,
        timestamp,
        packages
    };

    ost.set('metadata', metadata);

    console.log('Loaded icons', metadata);

    loading.visible = false;

    initPackages(metadata.packages);

};

const read = async (k, target) => {
    if (!state.ost) {
        return;
    }

    const v = await state.ost.get(k);
    //console.log('ost get', k, v);

    if (typeof v === 'undefined') {
        return;
    }

    if (isRef(target)) {
        target.value = v;
        return;
    }

    for (const key in v) {
        target[key] = v[key];
    }

};

const save = function(k, v) {
    if (!state.ost) {
        return;
    }
    state.ost.set(k, toRaw(v));
};

watch(layout, (v) => {
    save('layout', v);
});

watch(myIcons, (v) => {
    save('myIcons', v);
});

watch(settings, (v) => {
    save('settings', v);
});

onMounted(() => {
    loadStart();
    initTooltip();
});

</script>
<template>
  <div class="oi-app">
    <VuiLayout
      v-model="layout"
      width="100%"
      height="100%"
      gutter-size="0"
      gutter-hover-size="2px"
    >
      <div class="oi-layout-packages">
        <VuiFlex
          direction="column"
          height="100%"
        >
          <div class="oi-packages-header">
            <div class="oi-title">
              Open Icons <span><a
                href="https://github.com/cenfun/open-icons"
                target="_blank"
              >v{{ version }}</a></span>
            </div>
          </div>
          <div class="oi-packages-grid vui-flex-auto" />
        </VuiFlex>
      </div>

      <div class="oi-layout-main">
        <VuiTab v-model="state.tabIndex">
          <template #right>
            <div class="vui-flex-auto" />
            <OiSettings />
            <div class="oi-header-right">
              <a
                class="oi-icon oi-icon-github"
                href="https://github.com/cenfun/open-icons"
                target="_blank"
              />
            </div>
          </template>

          <template #tabs>
            <div class="vui-flex-row">
              <div class="oi-icon oi-icon-finder" />
              <b>Icon Finder</b>
            </div>
            <div class="vui-flex-row">
              <div class="oi-icon oi-icon-my" />
              <b>My Icons</b>
            </div>
          </template>

          <template #panes>
            <OiFinder />
            <OiMy />
          </template>
        </VuiTab>
      </div>
    </VuiLayout>

    <OiLoading />
  </div>
</template>
<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
    font-size: 14px;
    font-family: arial, sans-serif;
    width: 100%;
    height: 100%;
}

a:link,
a:visited {
    color: #002b36;
    text-decoration: none;
    background-color: transparent;
}

a:hover {
    color: #3fa8f8;
    text-decoration: underline;
}

/* icon */

.oi-icon {
    display: block;
    overflow: hidden;
    width: 20px;
    height: 20px;
    background-size: 20px 20px;
    background-position: center center;
    background-repeat: no-repeat;
    opacity: 0.6;
}

.oi-icon:hover {
    opacity: 1;
}

.oi-icon-disabled,
.oi-icon-disabled:hover {
    opacity: 0.3;
}

.oi-icon-normal,
.oi-icon-normal:hover {
    opacity: 1;
}

.oi-icon-github {
    background-image: url("./images/github.svg");
}

.oi-icon-finder {
    background-image: url("./images/search.svg");
}

.oi-icon-my {
    background-image: url("./images/star.svg");
}

.oi-icon-searcher {
    background-image: url("./images/searcher.svg");
}

.oi-icon-add {
    background-image: url("./images/plus.svg");
}

.oi-icon-ok {
    background-image: url("./images/ok.svg");
}

/* app */

.oi-app {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.oi-layout-packages {
    min-width: 200px;
    max-width: 50%;
    color: #eee;
    border-right: thin solid #1e1e1e;
    background-color: #1e1e1e;

    a:visited,
    a:link {
        color: #eee;
        text-decoration: none;
    }

    a:hover {
        color: #fff;
        text-decoration: underline;
    }

    .tg-total {
        font-weight: bold;
    }

    .oi-icon-total {
        width: 100%;
        height: 100%;

        &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 0;
            border: 6px solid transparent;
            box-sizing: border-box;
            overflow: hidden;
            border-left-color: #ddd;
            margin-left: 3px;
        }
    }
}

.oi-layout-main {
    position: relative;
}

.vui-tab-item .oi-icon {
    width: 16px;
    height: 16px;
    background-size: 16px 16px;
    margin-right: 5px;
}

.oi-packages-header {
    font-size: 16px;
    font-weight: bold;
    padding: 0 20px 0 15px;
    height: 41px;
    line-height: 41px;
    display: flex;
    flex-direction: row;
    background-color: #000;
}

.oi-title {
    font-weight: bold;
    font-size: 18px;

    span {
        font-weight: normal;
        margin-left: 5px;
        font-size: 14px;

        a:link,
        a:visited {
            color: #999;
        }
    }
}

.oi-header-right {
    margin: 0 10px;
}

.oi-packages-grid {
    width: 100%;
    height: 100%;
}

.oi-packages-grid .tg-row .tg-tree-name {
    cursor: pointer;
}

.oi-packages-grid .tg-pane .tg-scrollbar-thumb {
    background-color: #666;
}

.oi-packages-grid .tg-pane .tg-scrollbar-thumb:hover {
    background-color: #999;
}

</style>
