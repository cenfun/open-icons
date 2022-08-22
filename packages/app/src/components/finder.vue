<script setup>
import VineUI from 'vine-ui';
import { Grid } from 'turbogrid';
import {
    inject, nextTick, ref, watch
} from 'vue';
import { BF } from '../util/util.js';

const { VuiFlex } = VineUI;

const props = defineProps({
    packageName: {
        type: String,
        default: ''
    }
});

const state = inject('state');
const settings = inject('settings');

const item = ref(null);
const keywords = ref('');

const createGrid = () => {
    const grid = new Grid('.wi-grid-icons');
    state.gridIcons = grid;
    return grid;
};


const renderGrid = () => {
    let grid = state.gridIcons;

    if (!grid) {
        grid = createGrid();
    }

    const cellSize = parseInt(settings.size) + 10;

    grid.setOption({
        rowHeight: cellSize,
        frozenColumn: 1,
        rowNotFound: '<div class="wi-not-found">Not found results</div>',
        rowFilter: function(rowData) {
            if (!keywords.value) {
                return true;
            }
            const iconName = rowData.name;
            const parts = iconName.split('-');
            for (let i = 0; i < keywords.value; i++) {
                const keyword = keywords[i];
                if (parts.includes(keyword) || iconName.startsWith(keyword)) {
                    return true;
                }
            }
            return false;
        },
        selectVisible: true,
        selectAllVisible: false,
        rowNumberVisible: true,
        rowNumberWidth: 52,
        scrollbarRound: true,
        bindWindowResize: true,
        bindContainerResize: true
    });

    const rows = [];

    const pkg = item.value;

    pkg.icons.forEach((ic) => {

        const iconName = ic.name;
        //addPopular(iconName);

        rows.push({
            tag: item.value.tagName,
            name: iconName,
            package: item.value.name,
            svg: ic.svg
        });
    });


    const gridData = {
        columns: [{
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
    };

    grid.setData(gridData);

    grid.render();

};

const render = () => {
    const packages = state.packages;
    const packageName = state.packageName;

    let pkg;

    if (packageName && packageName !== 'total') {
        pkg = packages.find((it) => it.name === packageName);
    }

    if (!pkg) {
        pkg = state.total;
    }

    //console.log(pkg);

    item.value = pkg;

    nextTick(() => {
        renderGrid();
    });

};


watch(() => props.packageName, (v) => {
    render();
});

watch(settings, () => {
    renderGrid();
});

</script>
<template>
  <VuiFlex
    v-if="item"
    direction="column"
    spacing="10px"
    height="100%"
  >
    <div class="wi-pkg-title">
      {{ item.name }}
    </div>
    <div class="wi-pkg-link">
      <a
        :href="item.source.url"
        target="_blank"
      >{{ item.source.name }}@{{ item.source.version }} - {{ item.source.license }}</a>
    </div>
    <div class="wi-pkg-stats">
      <b>{{ item.iconsNum }}</b> icons / size: {{ BF(item.size) }} / gzip: {{ BF(item.sizeGzip) }} / <a
        :href="'/dist/'+item.namespace+'.js'"
        target="_blank"
      >{{ item.namespace }}.js</a>
    </div>

    <div class="wi-filter flex-row">
      <div class="wi-searcher">
        <input
          type="text"
          class="wi-keywords flex-auto"
          onfocus="this.select()"
        >
        <div class="wi-icon wi-icon-searcher" />
      </div>
    </div>
    <div class="wi-popular" />
    <div class="wi-grid-icons vui-flex-auto" />
  </VuiFlex>
</template>
<style lang="scss">

.wi-pkg-title {
    text-align: center;
    font-weight: bold;
    font-size: 38px;
    padding: 15px 0 5px 0;
}

.wi-pkg-link {
    text-align: center;
    padding-bottom: 5px;
}

.wi-pkg-link a:link,
.wi-pkg-link a:visited {
    font-size: 16px;
    color: #666;
}

.wi-pkg-link a:hover {
    color: #0077cf;
}

.wi-pkg-stats {
    text-align: center;
    font-size: 18px;
}

.wi-pkg-stats a:link,
.wi-pkg-stats a:visited {
    font-size: 16px;
}

.wi-pkg-stats a:hover {
    color: #0077cf;
}

.wi-filter {
    text-align: center;
    margin: 0 auto;
    width: 60%;
    max-width: 500px;
    margin-top: 10px;
}

.wi-searcher {
    width: 100%;
    position: relative;

    .wi-icon-searcher {
        position: absolute;
        width: 30px;
        height: 30px;
        background-size: 30px 30px;
        right: 15px;
        top: 13px;
        opacity: 0.3;
    }
}

.wi-keywords {
    border: 3px solid transparent;
    border-radius: 15px;
    padding: 10px 50px 10px 15px;
    background-color: #eee;
    height: 32px;
    line-height: 32px;
    outline: none;
    font-size: 18px;
    box-sizing: content-box;
    display: block;
    width: calc(100% - 70px);
}

.wi-keywords:focus {
    border: 3px solid lightblue;
}

.wi-popular {
    text-align: center;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.wi-popular span {
    margin-left: 5px;
    text-decoration: underline;
    cursor: pointer;
}

.wi-popular span:hover {
    color: deepskyblue;
}

.wi-popular i {
    cursor: pointer;
    width: 24px;
    height: 24px;
    margin-left: 10px;
    background-repeat: no-repeat;
    background-position: center center;
    opacity: 0.6;
}

.wi-popular i:hover {
    opacity: 1;
}

.wi-grid-icons {
    border: thin solid #ccc;
    border-radius: 5px;
    margin: 10px 10px;
}


.wi-grid-icons .tg-turbogrid .tg-cell.wi-icon {
    padding: 4px;
    border-left: thin solid #e5e5e5;
    border-right: thin solid #e5e5e5;
}

.wi-grid-icons .tg-turbogrid .tg-cell.wi-textarea {
    padding: 3px 5px;
}

.wi-grid-icons .tg-turbogrid .tg-cell.wi-textarea textarea {
    width: 100%;
    height: 100%;
    resize: none;
    font-family: monaco, sans-serif;
}

.wi-grid-icons .wi-icon-action {
    cursor: pointer;
    opacity: 0.6;
}

.wi-grid-icons .wi-icon-action:hover {
    opacity: 1;
}

.wi-grid-icons .tg-turbogrid .tg-cell .wi-icon-action {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.wi-grid-icons .wi-not-found {
    font-size: 20px;
}


</style>
