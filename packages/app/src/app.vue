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
          <VuiFlex
            spacing="10px"
            class="oi-packages-header"
          >
            <div class="oi-title vui-flex-auto">
              <a href="./">Open Icons</a>
            </div>
            <a
              href="https://github.com/cenfun/open-icons"
              target="_blank"
              tooltip="Fork github repository"
            ><OiIcon
              name="github"
              hover
            /></a>
          </VuiFlex>
          <div class="oi-packages-filter">
            <input
              v-model="keywords"
              onfocus="this.select()"
              placeholder=""
            >
            <OiIcon
              color="#666"
              name="searcher"
            />
          </div>
          <div class="oi-packages-grid vui-flex-auto" />
          <div class="oi-packages-footer">
            <a
              href="https://github.com/cenfun/open-icons"
              target="_blank"
            >v{{ version }}</a>
            cached
            (<span @click="cleanCache">clean</span>)
          </div>
        </VuiFlex>
      </div>

      <div class="oi-layout-main">
        <VuiTab v-model="state.tabIndex">
          <template #right>
            <div class="vui-flex-auto" />
            <OiSettings />
          </template>

          <template #tabs>
            <div class="vui-flex-row">
              <OiIcon
                name="finder"
                size="16px"
              />
              <b>Icon Finder</b>
            </div>
            <div class="vui-flex-row">
              <OiIcon
                name="my"
                size="16px"
              />
              <b>My Icons</b><span
                v-if="myIcons.ids.length"
                class="oi-my-icons"
              >{{ myIcons.ids.length }}</span>
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

<script setup>
import VineUI from 'vine-ui';
import {
    isRef,
    onMounted, provide, reactive, ref, shallowReactive, toRaw, watch
} from 'vue';
import { deleteDB, openStore } from 'open-store';
import { Grid } from 'turbogrid';
import {
    loadPackages, initSvg, defineIconElement, version, timestamp
} from 'open-icons';

import { hasOwn, BF } from './util/util.js';
import { initTooltip } from './util/tooltip.js';
import { getSourceFrom } from './util/grid-helper.js';

import OiIcon from './components/icon.vue';
import OiLoading from './components/loading.vue';
import OiSettings from './components/settings.vue';
import OiFinder from './components/finder.vue';
import OiMy from './components/my.vue';

const dbName = 'open-icons';

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
    tabIndex: 0,
    results: '',
    // grid and thumb
    viewType: 'grid'
});

provide('state', state);

const myIcons = reactive({
    ids: [],
    icons: {}
});

provide('myIcons', myIcons);

const defaultSettings = {
    type: '',
    size: '',
    sizeCustom: '48',
    color: 'rainbow',
    colorCustom: '',
    bg: '',
    bgCustom: '',
    radius: '',
    iconZoomIn: true
};

const settings = shallowReactive(defaultSettings);

provide('settings', settings);

const keywords = ref('');

const renderPackages = function(packages) {

    const rows = packages.map((pkg) => {
        pkg.iconCount = pkg.icons.length;
        pkg.sourceFrom = getSourceFrom(pkg.source);
        pkg.sourceLicense = pkg.source.license;
        pkg.sizeAvg = pkg.size / pkg.iconCount;
        return pkg;
    });

    rows.unshift(state.total);

    const gridData = {
        columns: [{
            id: 'name',
            name: 'Name',
            width: 90
        }, {
            id: 'iconCount',
            name: 'Icons',
            type: 'number',
            formatter: (v) => {
                return v.toLocaleString();
            },
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
            id: 'sizeAvg',
            name: 'Avg',
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
        // console.log(e.type);
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

        dist: function(value, rowItem, columnItem, cellNode) {
            if (!rowItem.id) {
                return '???';
            }
            const bundleName = `${rowItem.id}.js`;
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
        rowNumberWidth: 35,
        scrollbarRound: true,
        bindWindowResize: true,
        bindContainerResize: true,
        rowNotFound: '<div class="oi-not-found">Not found packages</div>',
        rowFilter: function(pkg) {
            let kw = keywords.value.trim();
            if (!kw) {
                return true;
            }

            kw = kw.toLowerCase();

            if (pkg.name.indexOf(kw) !== -1) {
                return true;
            }

            if (pkg.source.name.indexOf(kw) !== -1) {
                return true;
            }

            return false;
        }
    });

    grid.setData(gridData);
    grid.render();

    state.packagesGrid = grid;

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

    if (!list.length) {
        return [];
    }

    list.sort((a, b) => {
        return b.num - a.num;
    });

    const max = list[0].num;
    list.forEach((it) => {
        it.prob = Math.round(it.num / max * 100);
    });

    const ls = list.filter((it) => it.prob > 0);

    // console.log(ls.length);

    return ls;
};

const initPackages = function(packages) {

    let totalSize = 0;
    let totalGzip = 0;
    const allIcons = [];
    const allTags = {};

    const tagName = 'open-icon';

    packages.forEach(function(pkg) {

        totalSize += pkg.size;
        totalGzip += pkg.sizeGzip;

        const tags = {};

        pkg.icons.forEach((icon) => {
            const iconName = icon.name;
            addTag(allTags, iconName);
            addTag(tags, iconName);

            initSvg(icon);

            icon.packageName = pkg.name;
            icon.tagName = tagName;

            allIcons.push(icon);
        });

        pkg.tags = getTags(tags);

        if (!pkg.tags.length) {
            console.log(`Not found any tags: ${pkg.name}`);
        }

    });

    state.total = {
        name: 'total',
        fullName: 'Open Icons',
        type: 'total',
        source: {
            name: 'open-icons',
            version: version,
            url: 'https://github.com/cenfun/open-icons',
            license: 'MIT'
        },
        id: 'open-icons',
        tags: getTags(allTags),
        icons: allIcons,
        iconCount: allIcons.length,
        size: totalSize,
        sizeGzip: totalGzip,
        sizeAvg: totalSize / allIcons.length,
        selectable: true
    };

    defineIconElement(tagName, allIcons);

    loading.visible = false;

    state.icons = allIcons;

    state.packages = packages;
    state.packageName = location.hash.substr(1);
    // console.log(state.packageName);

    renderPackages(packages);

};

const loadStart = async () => {

    const ost = await openStore(dbName);
    state.ost = ost;

    await read('layout', layout);
    await read('settings', settings);
    await read('myIcons', myIcons);

    const path = window.WC_ICONS_PATH;

    console.log('wc icons path:', path);

    // console.log(db);
    const cache = await ost.get('metadata');
    // console.log(cache);
    if (cache && cache.version === version) {

        console.log('Found cache icons', cache);

        initPackages(cache.packages);

        return;
    }

    const packages = await loadPackages(path, (item, info) => {
        // console.log(info);
        const percentage = Math.round(info.loadedSize / info.totalSize * 100);
        loading.percentage = percentage;
        loading.text = `Loading ${info.loaded} / ${info.total} - ${item.name}`;
        loading.detail = `${BF(info.loadedSize)} / ${BF(info.totalSize)} - ${percentage}%`;
    });

    // sort packages
    packages.sort(function(a, b) {
        return a.name > b.name ? 1 : -1;
    });

    const metadata = {
        version,
        timestamp,
        packages
    };

    ost.set('metadata', metadata);

    console.log('Loaded icons', metadata);

    initPackages(metadata.packages);

};

const read = async (k, target) => {
    if (!state.ost) {
        return;
    }

    const v = await state.ost.get(k);
    // console.log('ost get', k, v);

    if (typeof v === 'undefined') {
        return;
    }

    if (isRef(target)) {
        target.value = v;
        return;
    }

    for (const key in v) {
        if (hasOwn(target, key)) {
            target[key] = v[key];
        }
    }

};

const save = function(k, v) {
    if (!state.ost) {
        return;
    }
    state.ost.set(k, toRaw(v));
};

const cleanCache = () => {
    deleteDB(dbName);
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

watch(keywords, () => {
    if (state.packagesGrid) {
        state.packagesGrid.update();
    }
});

onMounted(() => {
    loadStart();
    initTooltip();
});

</script>

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
    margin-right: 5px;
}

.oi-packages-header {
    font-size: 16px;
    font-weight: bold;
    padding: 0 20px 0 15px;
    height: 41px;
    line-height: 41px;
    background-color: #000;
}

.oi-title {
    font-weight: bold;
    font-size: 18px;
}

.oi-packages-filter {
    position: relative;
    padding: 8px;
    max-width: 300px;

    input {
        display: block;
        width: 100%;
        border-radius: 5px;
        border: none;
        padding: 5px;
    }

    .oi-icon {
        position: absolute;
        left: 100%;
        top: 50%;
        transform: translate(-30px, -50%);
        z-index: 2;
    }
}

.oi-packages-grid {
    border-top: 1px solid #333;
    width: 100%;
    height: 100%;

    .tg-tree-name {
        text-transform: capitalize;
    }

    .tg-row .tg-tree-name {
        cursor: pointer;
    }

    .tg-pane .tg-scrollbar-thumb {
        background-color: #666;
    }

    .tg-pane .tg-scrollbar-thumb:hover {
        background-color: #999;
    }
}

.oi-packages-footer {
    background-color: #000;
    padding: 5px 8px;
    color: #999;

    span {
        cursor: pointer;
    }

    span:hover {
        text-decoration: underline;
    }

    a:link,
    a:visited {
        color: #999;
    }
}

.oi-view-body {
    position: relative;
    border: thin solid #ccc;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px;
}

.oi-grid {
    width: 100%;
    height: 100%;

    .oi-not-found {
        font-size: 20px;
    }

    .oi-action-downloads {
        justify-content: center;
        align-items: center;
        height: 100%;

        .oi-icon-download {
            font-family: Menlo, Consolas, monospace;
            font-weight: bold;
            cursor: pointer;
            opacity: 0.6;

            &:first-child {
                margin-right: 10px;
            }
        }

        .oi-icon-download:hover {
            opacity: 1;
            text-decoration: underline;
        }
    }

    .tg-cell.oi-grid-icon {
        padding: 4px;
        border-left: thin solid #e5e5e5;
        border-right: thin solid #e5e5e5;
    }

    .tg-cell.oi-textarea {
        padding: 3px 5px;

        textarea {
            width: 100%;
            height: 100%;
            resize: none;
        }
    }
}

.oi-cell-icon {
    --size: 100%;
    --color: #000;
    --bg: none;
    --radius: 0;

    width: var(--size);
    height: var(--size);
    color: var(--color);
    background: var(--bg);
    border-radius: var(--radius);
    overflow: hidden;

    svg {
        display: block;
        pointer-events: none;
    }
}

.oi-my-icons {
    font-size: 12px;
    margin-left: 8px;
    background-color: #999;
    border-radius: 50%;
    display: inline-block;
    height: 20px;
    line-height: 20px;
    font-weight: bold;
    padding: 0 6px;
    color: #fff;
}
</style>
