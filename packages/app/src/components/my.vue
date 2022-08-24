<script setup>
import VineUI from 'vine-ui';
import { Grid } from 'turbogrid';

import {
    inject, onMounted, ref, watch
} from 'vue';
import { throttle } from '../util/util.js';

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

const createGrid = () => {

    const grid = new Grid('.oi-my-grid');


    state.myGrid = grid;

    return grid;
};

const renderGrid = () => {
    const grid = getCurrentGrid();
    if (!grid) {
        return;
    }

    grid.setOption({
        rowNumberVisible: true,
        selectVisible: true

    });

    grid.setFormatter({

    });

    const rows = myIcons.icons.map((k) => {
        return {
            name: k
        };
    });

    grid.setData({
        columns: [{
            id: 'name',
            name: 'Name'
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

    const selectedIcons = selectedRows.map((row) => row.name);

    myIcons.icons = myIcons.icons.filter((iconName) => {
        if (selectedIcons.includes(iconName)) {
            return false;
        }
        return true;
    });

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
        <VuiButton @click="removeSelected()">
          Remove
        </VuiButton>
      </VuiFlex>
    </div>
    <div class="oi-my-grid vui-flex-auto" />
  </VuiFlex>
</template>
<style lang="scss">
.oi-toolbar {
    padding: 10px 10px 0;
}

.oi-my-grid {
    border: thin solid #ccc;
    border-radius: 5px;
    margin: 10px;
}
</style>
