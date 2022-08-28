<script setup>
import VineUI from 'vine-ui';
import { Grid } from 'turbogrid';

import {
    inject, onMounted, ref, watch
} from 'vue';
import { throttle } from '../util/util.js';
import {
    formatter, getCellIcon, saveSVG, savePNG
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

const getIconById = (id) => {
    const item = state.icons.find((icon) => icon.id === id);
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

    //maybe a get function
    itemNew.svg = item.svg;

    const customData = myIcons.icons[id];
    if (customData) {
        Object.assign(itemNew, customData);
    }

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
            return getCellIcon(settings, r);
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

    const cellSize = (parseInt(settings.size) || 32) + 10;

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

    myIcons.ids.forEach((id) => {
        const item = getIconById(id);
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

    const selectedIcons = selectedRows.map((row) => row.id);

    myIcons.ids = myIcons.ids.filter((id) => {
        if (selectedIcons.includes(id)) {
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
    <div class="oi-view-body vui-flex-auto">
      <div class="oi-grid oi-my-grid" />
    </div>
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
