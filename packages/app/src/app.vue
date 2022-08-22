<script setup>
import VineUI from 'vine-ui';
import {
    onMounted, provide, ref, shallowReactive, watch
} from 'vue';
import openStore from 'open-store';
import { Grid } from 'turbogrid';
import {
    loadPackages, getIconElement, version, timestamp
} from 'web-icons';

import WiLoading from './components/loading.vue';
import WiFinder from './components/finder.vue';
import { BF } from './util/util.js';

const {
    VuiLayout, VuiFlex, VuiTab
} = VineUI;

const layout = ref('30%,auto');

const state = shallowReactive({
    ost: null,
    packages: null,
    packageName: null,
    total: null
});

provide('state', state);

const tabActive = ref(0);

const loadingText = ref('Loading Web Icons ...');
const loadingVisible = ref(true);


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

    const gridPackages = new Grid('.wi-grid-packages');

    gridPackages.bind('onFirstUpdated', function(e) {
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

    gridPackages.bind('onClick', function(e, d) {
        if (!d.rowNode) {
            return;
        }
        const rowItem = d.rowItem;
        const packageName = rowItem.hash || rowItem.name;
        state.packageName = packageName;
        document.location.hash = packageName;
        gridPackages.setRowSelected(rowItem, d.e);
    });

    gridPackages.setFormatter({

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

    gridPackages.setOption({
        theme: 'dark',
        frozenRow: 0,
        frozenColumn: 0,
        frozenRowHoverable: true,
        selectMultiple: false,
        rowNumberVisible: true,
        rowNumberWidth: 30,
        bindWindowResize: true,
        bindContainerResize: true
    });

    gridPackages.setData(gridData);
    gridPackages.render();

};


const initPackages = function(packages) {

    let totalIcons = 0;
    let totalSize = 0;
    let totalGzip = 0;
    packages.forEach(function(pkg) {

        totalIcons += pkg.icons.length;
        totalSize += pkg.size;
        totalGzip += pkg.sizeGzip;

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
        hash: 'total',
        source: {
            name: 'web-icons',
            url: 'https://github.com/cenfun/web-icons'
        },
        iconsNum: totalIcons.toLocaleString(),
        size: totalSize,
        sizeGzip: totalGzip,
        selectable: true
    };

    state.packages = packages;
    state.packageName = location.hash.substr(1);

    renderPackages(packages);

};

const loadStart = async () => {

    const ost = await openStore('wi');
    state.ost = ost;

    const prevLayout = await ost.get('layout');
    if (prevLayout) {
        //console.log('layout', prevLayout);
        layout.value = prevLayout;
    }

    //console.log(db);
    const cache = await ost.get('metadata');
    //console.log(cache);
    if (cache && cache.version === version) {

        console.log('Found cache icons', cache);
        loadingVisible.value = false;

        initPackages(cache.packages);

        return;
    }

    const packages = await loadPackages('../node_modules/web-icons/dist/', (item, info) => {
        //console.log(info);
        const per = Math.round(info.loadedSize / info.totalSize * 100);
        loadingText.value = `Loading ${per}% (${info.loaded}/${info.total}) - ${item.name}`;
    });


    const metadata = {
        version,
        timestamp,
        packages
    };

    ost.set('metadata', metadata);

    console.log('Loaded icons', metadata);

    loadingVisible.value = false;

    initPackages(metadata.packages);

};

watch(layout, (v) => {
    if (state.ost) {
        state.ost.set('layout', v);
    }
});

onMounted(() => {
    loadStart();
});

</script>
<template>
  <div class="wi-app">
    <VuiLayout
      v-show="state.packages"
      v-model="layout"
      width="100%"
      height="100%"
      gutter-size="0"
      gutter-hover-size="2px"
    >
      <div class="wi-layout-packages">
        <VuiFlex
          direction="column"
          height="100%"
        >
          <div class="wi-packages-header">
            <div class="wi-title">
              Web Icons <span>v{{ version }}</span>
            </div>
          </div>
          <div class="wi-grid-packages vui-flex-auto" />
        </VuiFlex>
      </div>

      <div class="wi-layout-main">
        <VuiTab v-model="tabActive">
          <template #right>
            <div class="vui-flex-auto" />
            <div class="wi-header-right">
              <a
                class="wi-icon wi-icon-github"
                href="https://github.com/cenfun/web-icons"
                target="_blank"
              />
            </div>
          </template>

          <template #tabs>
            <div class="vui-flex-row">
              <div class="wi-icon wi-icon-finder" />
              <b>Icon Finder</b>
            </div>
            <div class="vui-flex-row">
              <div class="wi-icon wi-icon-my" />
              <b>My Icons</b>
            </div>
          </template>

          <template #panes>
            <WiFinder :package-name="state.packageName" />

            <VuiFlex direction="column">
              <div class="vui-filter" />
            </VuiFlex>
          </template>
        </VuiTab>
      </div>
    </VuiLayout>

    <WiLoading
      :visible="loadingVisible"
      :text="loadingText"
    />
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

.wi-icon {
    display: block;
    overflow: hidden;
    width: 20px;
    height: 20px;
    background-size: 20px 20px;
    background-position: center center;
    background-repeat: no-repeat;
    opacity: 0.6;
}

.wi-icon:hover {
    opacity: 1;
}

.wi-icon-github {
    background-image: url("./images/github.svg");
}

.wi-icon-finder {
    background-image: url("./images/search.svg");
}

.wi-icon-my {
    background-image: url("./images/star.svg");
}

/* app */

.wi-app {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.wi-layout-packages {
    min-width: 200px;
    max-width: 50%;
    color: #eee;

    a:visited,
    a:link {
        color: #eee;
        text-decoration: none;
    }

    a:hover {
        color: #fff;
        text-decoration: underline;
    }
}

.wi-layout-main {
    position: relative;
}

.vui-tab-item .wi-icon {
    width: 16px;
    height: 16px;
    background-size: 16px 16px;
    margin-right: 5px;
}

.wi-packages-header {
    font-size: 16px;
    font-weight: bold;
    padding: 0 20px 0 15px;
    height: 41px;
    line-height: 41px;
    display: flex;
    flex-direction: row;
    background-color: #000;
}

.wi-title {
    font-weight: bold;
    font-size: 18px;

    span {
        font-weight: normal;
        margin-left: 5px;
        font-size: 14px;
        color: gray;
    }
}

.wi-header-right {
    margin-right: 10px;
}

.wi-grid-packages {
    width: 100%;
    height: 100%;
}

.wi-grid-packages .tg-row .tg-tree-name {
    cursor: pointer;
}

.wi-grid-packages .tg-pane .tg-scrollbar-thumb {
    background-color: #666;
}

.wi-grid-packages .tg-pane .tg-scrollbar-thumb:hover {
    background-color: #999;
}

</style>
