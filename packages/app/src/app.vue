<template>
  <div class="wi-app">
    <VuiLayout
      v-model="layout"
      width="100%"
      height="100%"
      gutter-size="2px"
    >
      <div class="wi-layout-left">
        <div class="wi-grid wi-grid-packages" />
      </div>

      <div class="wi-layout-right">
        <VuiTab
          v-model="tabActive"
          align="center"
        >
          <template #left>
            <div class="wi-header-left">
              <div class="wi-title">
                Web Icons <span>v{{ version }}</span>
              </div>
            </div>
          </template>

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
              <div class="wi-icon wi-icon-packages" />
              <b>Packages</b>
            </div>
            <div class="vui-flex-row">
              <div class="wi-icon wi-icon-my-icons" />
              <b>My Icons</b>
            </div>
          </template>

          <template #panes>
            <VuiFlex
              direction="column"
              class="wi-pane"
            >
              <div class="vui-filter" />
            </VuiFlex>

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
<script setup>
import VineUI from 'vine-ui';
import {
    onMounted, onUnmounted, reactive, ref, watch
} from 'vue';
import openStore from 'open-store';
import { Grid } from 'turbogrid';
import {
    loadPackages, getIconElement, version, timestamp
} from 'web-icons';

import WiLoading from './components/loading.vue';
import { BF } from './util/util.js';

const {
    VuiLayout, VuiFlex, VuiTab
} = VineUI;

const layout = ref('30%,auto');

const state = reactive({
    ost: null
});

const tabActive = ref(0);

const loadingText = ref('Loading ...');
const loadingVisible = ref(true);


const renderPackages = function(packages) {

    const rows = packages.map((pkg) => {
        pkg.iconsNum = pkg.icons.length.toLocaleString();
        pkg.sourceFrom = `${pkg.source.name}@${pkg.source.version}`;
        pkg.sourceLicense = pkg.source.license;
        return pkg;
    });

    const total = packages.reduce((v, pkg) => v + pkg.icons.length, 0);
    const size = packages.reduce((v, pkg) => v + pkg.size, 0);
    const sizeGzip = packages.reduce((v, pkg) => v + pkg.sizeGzip, 0);

    rows.unshift({
        name: 'Total',
        iconsNum: total.toLocaleString(),
        size,
        sizeGzip,
        selectable: true
    });

    const gridData = {
        columns: [{
            id: 'name',
            name: 'Name',
            width: 120
        }, {
            id: 'iconsNum',
            name: 'Icons',
            type: 'number'
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

    gridPackages.bind('onClick', function(e, d) {
        if (!d.rowNode) {
            return;
        }
        const rowItem = d.rowItem;
        document.location.hash = rowItem.hash || rowItem.name;
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
        theme: 'lightblue',
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

    // const date = new Date(timestamp).toLocaleDateString();
    // const footer = `<a href="https://github.com/cenfun/wi" target="_blank">Latest: v${version} - ${date}</a>`;

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

    renderPackages(packages);

    //renderStart(packages);
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
        loadingText.value = `loaded ${per}% (${info.loaded}/${info.total}) - ${item.name}`;
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

onUnmounted(() => {

});

</script>
<style lang="scss" src="./app.scss"></style>
