<template>
  <div class="wi-app">
    <VuiTab
      v-model="tabActive"
      position="left"
    >
      <template #toolbar>
        <div class="wi-state vui-flex-auto">
          {{ state.state }}
        </div>
        <VuiFlex spacing="10px">
          <a
            class="wi-title"
            href="https://cenfun.github.io/web-icons"
          >Web Icons</a>
          <a
            class="wi-icon wi-icon-github"
            href="https://github.com/cenfun/web-icons"
            target="_blank"
          />
        </VuiFlex>
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
          <div class="wi-grid wi-grid-packages vui-flex-auto" />
        </VuiFlex>
        <VuiFlex direction="column">
          <div class="vui-filter" />
          <div class="wi-grid wi-grid-my-icons vui-flex-auto" />
        </VuiFlex>
      </template>
    </VuiTab>
    <WiLoading
      :visible="loadingVisible"
      :text="loadingText"
    />
  </div>
</template>
<script setup>
import VineUI from 'vine-ui';
import {
    onMounted, onUnmounted, reactive, ref
} from 'vue';
import openStore from 'open-store';
import { Grid } from 'turbogrid';
import {
    loadPackages, getIconElement, version, timestamp
} from 'web-icons';

import WiLoading from './components/loading.vue';
import { BF } from './util/util.js';

const { VuiFlex, VuiTab } = VineUI;

const state = reactive({
    state: ''
});

const tabActive = ref(0);

const loadingText = ref('Loading ...');
const loadingVisible = ref(true);


const renderPackages = function(packages) {

    const rows = packages.map((pkg) => {
        pkg.iconsNum = pkg.icons.length.toLocaleString();
        pkg.sourceName = pkg.source.name;
        pkg.sourceVersion = pkg.source.version;
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
            id: 'sourceName',
            name: 'Source Name',
            formatter: 'source',
            width: 150
        }, {
            id: 'sourceVersion',
            name: 'Version',
            formatter: 'source',
            width: 65
        }, {
            id: 'sourceLicense',
            name: 'License',
            formatter: 'source',
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
        // rowNumber: function(value, rowItem, columnItem, cellNode) {
        //     const defaultFormatter = this.getDefaultFormatter('rowNumber');
        //     if (rowItem.type === 'finder') {
        //         return '<svg pointer-events="none" width="100%" height="100%" viewBox="0 0 24 24"><g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="currentColor"><path d="M0 0h24v24H0z" stroke="none"/><circle cx="10" cy="10" r="7"/><path d="m21 21-6-6"/></g></svg>';
        //     }
        //     return defaultFormatter(value, rowItem, columnItem, cellNode);
        // }
        source: function(value, rowItem, columnItem, cellNode) {
            if (!value) {
                return '';
            }

            return value;

            // const bundle = `<a href="dist/${rowItem.namespace}.js" target="_blank">${rowItem.namespace}.js</a>`;

            // return `
            //   <div class="wi-link"><a href="${source.url}" target="_blank">${source.name}@${source.version} - ${source.license}</a></div>
            //   <div class="wi-stats">bundle: ${bundle}</div>
            // `;
        },
        BF: function(value, rowItem, columnItem, cellNode) {
            return BF(value);
        }
    });

    gridPackages.setOption({
        theme: 'lightblue',
        frozenRow: 0,
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

onMounted(() => {
    loadStart();
});

onUnmounted(() => {

});

</script>
<style lang="scss" src="./app.scss"></style>
