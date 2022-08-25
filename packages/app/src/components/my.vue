<script setup>
import VineUI from 'vine-ui';
import { Grid } from 'turbogrid';

import {
    inject, onMounted, ref, watch
} from 'vue';
import { throttle } from '../util/util.js';
import {
    formatter, getIcon, saveSVG, savePNG
} from '../util/grid-helper.js';

import OiIcon from './icon.vue';

const { VuiFlex, VuiButton } = VineUI;

const state = inject('state');
const settings = inject('settings');
const myIcons = inject('myIcons');
const requestUpdate = ref(false);

const getCurrentGrid = () => {
    if (state.tabIndex === 1) {
        return state.myGrid;
    }
};

const getIconByNs = (ns) => {
    const item = state.icons.find((icon) => icon.namespace === ns);
    if (!item) {
        return;
    }

    const itemNew = {};

    Object.keys(item).forEach((k) => {
        if (k.startsWith('tg_')) {
            return;
        }
        itemNew[k] = item[k];
    });

    const customData = myIcons.icons[ns];
    if (customData) {
        Object.assign(itemNew, customData);
    }

    //console.log(itemNew);

    return itemNew;
};

const createGrid = () => {

    const grid = new Grid('.oi-my-grid');

    grid.bind('onClick', function(e, d) {
        const rowItem = d.rowItem;
        const $target = d.e.target;
        if ($target.tagName === 'TEXTAREA') {
            $target.select();
            return;
        }
        if ($target.classList.contains('oi-icon-download')) {
            const type = $target.getAttribute('name');
            if (type === 'png') {
                savePNG(rowItem.svg, rowItem.name, settings);
                return;
            }
            saveSVG(rowItem.svg, rowItem.name);
        }
    });

    grid.setFormatter({
        ... formatter,
        icon: function(v, r) {
            return getIcon(settings, r);
        }
    });

    state.myGrid = grid;

    return grid;
};

const renderGrid = () => {
    const grid = getCurrentGrid();
    if (!grid) {
        return;
    }

    const cellSize = parseInt(settings.size) + 10;

    grid.setOption({
        rowHeight: cellSize,
        frozenColumn: 1,
        rowNotFound: '<div class="oi-not-found">Not found icons</div>',
        rowNumberVisible: true,
        selectVisible: true,
        selectAllVisible: false,
        rowDragVisible: true,
        scrollbarRound: true,
        columnTypes: {
            name: ''
        },
        bindWindowResize: true,
        bindContainerResize: true
    });

    const rows = [];

    myIcons.ns.forEach((ns) => {
        const item = getIconByNs(ns);
        if (!item) {
            return;
        }
        rows.push(item);
    });

    grid.setData({
        columns: [{
            id: 'icon',
            name: '',
            width: cellSize,
            minWidth: cellSize,
            align: 'center',
            classMap: 'oi-grid-icon',
            formatter: 'icon',
            sortable: false
        }, {
            id: 'name',
            name: 'Name',
            width: 150
        }, {
            id: 'download',
            name: 'Download',
            formatter: 'download',
            align: 'center',
            resizable: false,
            width: 80
        }, {
            id: 'svg',
            name: 'Pure SVG',
            classMap: 'oi-textarea',
            formatter: 'textarea',
            sortable: false,
            align: 'center',
            width: 260,
            maxWidth: 1000
        }, {
            id: 'dataUrl',
            name: 'Data URL',
            classMap: 'oi-textarea',
            formatter: 'textarea',
            sortable: false,
            align: 'center',
            width: 260,
            maxWidth: 1000
        }, {
            id: 'wc',
            name: 'Web component',
            classMap: 'oi-textarea',
            formatter: 'textarea',
            sortable: false,
            align: 'center',
            width: 260,
            maxWidth: 500
        }, {
            id: 'packageName',
            name: 'Package'
        }],
        rows
    });

    grid.render();

};

const removeSelected = () => {
    const grid = getCurrentGrid();
    if (!grid) {
        return;
    }
    const selectedRows = grid.getSelectedRows();
    if (!selectedRows.length) {
        return;
    }
    grid.deleteRow(selectedRows);

    const selectedIcons = selectedRows.map((row) => row.namespace);

    myIcons.ns = myIcons.ns.filter((ns) => {
        if (selectedIcons.includes(ns)) {
            return false;
        }
        return true;
    });

};

const exportIcons = () => {
    console.log('exportIcons');
};

const renderGridAsync = throttle(renderGrid);

onMounted(() => {
    createGrid();
});

watch(settings, () => {
    requestUpdate.value = true;
    const grid = getCurrentGrid();
    if (grid) {
        renderGridAsync();
    }
});

watch(myIcons, (v) => {
    requestUpdate.value = true;
    const grid = getCurrentGrid();
    if (grid) {
        renderGrid();
    }
});

watch(() => state.tabIndex, (v) => {
    if (v === 0) {
        requestUpdate.value = false;
        return;
    }
    const grid = getCurrentGrid();
    if (grid && requestUpdate.value) {
        renderGrid();
    }
});

</script>
<template>
  <VuiFlex
    direction="column"
    spacing="10px"
    height="100%"
  >
    <div class="oi-toolbar">
      <VuiFlex spacing="10px">
        <VuiButton
          tooltip="Remove selected icons"
          @click="removeSelected()"
        >
          <OiIcon
            name="remove"
            size="16px"
          />
          Remove
        </VuiButton>
        <VuiButton
          tooltip="Export all my icons"
          @click="exportIcons()"
        >
          <OiIcon
            name="export"
            size="16px"
          />
          Export
        </VuiButton>
        <div class="vui-flex-empty" />
        <div>Will be cached in browser</div>
      </VuiFlex>
    </div>
    <div class="oi-grid oi-my-grid vui-flex-auto" />
  </VuiFlex>
</template>
<style lang="scss">
.oi-toolbar {
    padding: 10px 10px 0;

    button {
        display: flex;
        flex-direction: row;
        align-items: center;

        .oi-icon {
            margin-right: 5px;
        }
    }
}

.oi-my-grid {
    position: relative;
}
</style>
