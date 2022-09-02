<script setup>
import VineUI from 'vine-ui';
import { Grid } from 'turbogrid';

import {
    inject, nextTick, ref, watch
} from 'vue';

import { BF, throttle } from '../util/util.js';

import {
    formatter, getCellIcon, saveSVG, savePNG, getVueEl
} from '../util/grid-helper.js';

import OiIcon from './icon.vue';

const { VuiFlex } = VineUI;

const state = inject('state');
const settings = inject('settings');
const myIcons = inject('myIcons');
const requestUpdate = ref(false);
const packageInfo = ref(null);
const tagsList = ref([]);
const thumb = ref(null);
const thumbIcons = ref([]);

const keywords = ref('');
const rowFilter = function(icon) {

    //filter package
    const packageName = state.packageName;
    if (packageName && icon.packageName !== packageName) {
        return false;
    }

    const kw = keywords.value.trim();
    if (!kw) {
        return true;
    }

    const iconName = icon.name;
    const parts = iconName.split('-');
    if (parts.includes(kw) || iconName.startsWith(kw)) {
        return true;
    }

    return false;
};

const tagClickHandler = (tag) => {
    keywords.value = tag.name;
};

const hasIcon = function(icon) {
    return myIcons.ids.includes(icon.id);
};

const addIcon = function(icon) {
    if (hasIcon(icon)) {
        return false;
    }
    myIcons.ids.push(icon.id);
    return true;
};

const getCurrentGrid = () => {
    if (state.tabIndex === 0) {
        return state.finderGrid;
    }
};

const createGrid = () => {

    const grid = new Grid('.oi-finder-grid');
    grid.bind('onClick', function(e, d) {
        if (!d.cellNode) {
            return;
        }
        const rowItem = d.rowItem;
        const $target = d.e.target;
        if ($target.tagName === 'TEXTAREA') {
            $target.select();
            return;
        }
        if ($target.classList.contains('oi-icon-add')) {
            const added = addIcon(rowItem);
            if (added) {
                //using item, index is not right, icons list is filtered
                this.updateCell(d.rowItem, d.columnItem);
            }
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

    grid.bind('onUpdated', function(e, d) {
        state.results = this.viewRows.length;
    });

    grid.setFormatter({
        ... formatter,
        header: function(v, rowItem, columnItem) {
            if (columnItem.id === 'my') {
                return getVueEl(OiIcon, {
                    name: 'my'
                });
            }
            return v;
        },
        icon: function(v, r) {
            return getCellIcon(settings, r);
        },
        my: function(value, rowItem, columnItem, cellNode) {
            const v = rowItem.name;
            let $icon;
            if (hasIcon(rowItem)) {
                $icon = getVueEl(OiIcon, {
                    tooltip: `'${v}' already in my icons`,
                    name: 'ok',
                    disabled: true
                });
            } else {
                $icon = getVueEl(OiIcon, {
                    tooltip: `Add '${v}' to my icons`,
                    name: 'add'
                });
            }
            return $icon;
        }
    });

    state.finderGrid = grid;

    return grid;
};

const renderThumbIcons = (clean) => {

    let icons = thumbIcons.value;

    const num = icons.length;
    if (!num) {
        return;
    }

    const pageNum = 500;
    const showMore = num > pageNum;

    let leftIcons = [];

    if (showMore) {
        leftIcons = icons.splice(pageNum, num);
        icons = icons.slice(0, pageNum);
    }

    thumbIcons.value = leftIcons;

    //console.log(icons, leftIcons);

    const size = parseInt(settings.size) || 32;

    const list = icons.map((icon) => {
        const children = [`<div class="oi-thumb-item" title="${icon.name}">`];
        const cellIcon = getCellIcon(settings, icon);
        children.push(cellIcon);
        if (size >= 64) {
            children.push(`<div class="oi-thumb-label" style="width:${size}px;">${icon.name}</div>`);
        }
        children.push('</div>');
        return children.join('');
    });

    const str = list.join('');

    const $thumb = thumb.value;

    //const ts = Date.now();

    if (clean) {
        $thumb.firstChild.innerHTML = str;
    } else {
        $thumb.firstChild.insertAdjacentHTML('beforeend', str);
    }

    //console.log(Date.now() - ts);
};

const renderThumbView = () => {

    const icons = state.icons.filter((icon) => {
        return rowFilter(icon);
    });

    state.results = icons.length;
    thumbIcons.value = icons;

    renderThumbIcons(true);

};

const renderGridView = () => {

    let grid = getCurrentGrid();
    if (!grid) {
        grid = createGrid();
    }

    const cellSize = (parseInt(settings.size) || 32) + 10;

    grid.setOption({
        rowHeight: cellSize,
        frozenColumn: 1,
        rowNotFound: '<div class="oi-not-found">Not found icons</div>',
        rowFilter: rowFilter,
        rowNumberVisible: true,
        rowNumberWidth: 52,
        scrollbarRound: true,
        columnTypes: {
            name: ''
        },
        bindWindowResize: true,
        bindContainerResize: true
    });

    const columns = [{
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
        id: 'my',
        name: '',
        width: 30,
        classMap: 'oi-action-my',
        resizable: false,
        formatter: 'my'
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
        name: 'Package',
        align: 'center'
    }];

    //console.log(columns);

    grid.setData({
        columns: columns,
        rows: state.icons
    });

    grid.render();
};

const renderGrid = () => {
    //console.log('renderGrid', state.viewType);

    const $thumb = thumb.value;
    if (state.viewType === 'thumb') {
        $thumb.style.display = 'block';
        renderThumbView();
    } else {
        $thumb.style.display = 'none';
        renderGridView();
    }

};

const renderTags = (pkg) => {

    const tags = pkg.tags;

    const len = tags.length;

    const list = [];
    let num = 10;
    while (num > 0) {
        const item = tags[Math.floor(len * Math.random())];
        if (!list.includes(item)) {
            list.push(item);
            num -= 1;
        }
    }

    //console.log(list);

    tagsList.value = list;

    if (pkg.type === 'total' && !keywords.value) {
        keywords.value = list[0].name;
    }

};

const render = () => {
    const packages = state.packages;
    const packageName = state.packageName;

    let pkg;

    if (packageName) {
        pkg = packages.find((it) => it.name === packageName);
    }

    if (pkg) {
        keywords.value = '';
    } else {
        pkg = state.total;
    }

    console.log(pkg);
    renderTags(pkg);

    packageInfo.value = pkg;

    nextTick(() => {
        renderGrid();
    });

};

const renderGridAsync = throttle(renderGrid);

watch(() => state.packageName, (v) => {
    //change to finder tab
    state.tabIndex = 0;
    render();
});

watch(settings, () => {
    requestUpdate.value = true;
    const grid = getCurrentGrid();
    if (grid) {
        renderGridAsync();
    }
});

watch(() => state.viewType, (v) => {
    requestUpdate.value = true;
    const grid = getCurrentGrid();
    if (grid) {
        renderGrid();
    }
});

watch(keywords, () => {
    const grid = getCurrentGrid();
    if (grid) {
        if (state.viewType === 'thumb') {
            renderGrid();
            return;
        }
        grid.update();
    }
});

watch(myIcons, (v) => {
    requestUpdate.value = true;
});

watch(() => state.tabIndex, (v) => {
    if (v === 1) {
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
    v-if="packageInfo"
    direction="column"
    spacing="10px"
    height="100%"
  >
    <div class="oi-pkg-title">
      {{ packageInfo.fullName || packageInfo.name }}
    </div>
    <div class="oi-pkg-link">
      <a
        :href="packageInfo.source.url"
        target="_blank"
      >{{ packageInfo.source.name }}@{{ packageInfo.source.version }} - {{ packageInfo.source.license }}</a>
    </div>
    <div class="oi-pkg-stats">
      <b>{{ packageInfo.iconCount }}</b> icons / size: {{ BF(packageInfo.size) }} / gzip: {{ BF(packageInfo.sizeGzip) }} / <a
        :href="'/dist/'+packageInfo.id+'.js'"
        target="_blank"
      >{{ packageInfo.id }}.js</a>
    </div>

    <div class="oi-filter flex-row">
      <div class="oi-searcher">
        <input
          v-model="keywords"
          type="text"
          class="oi-keywords flex-auto"
          onfocus="this.select()"
        >
        <OiIcon name="searcher" />
      </div>
    </div>
    <div class="oi-tags">
      <span
        v-for="(tag, i) in tagsList"
        :key="i"
        @click="tagClickHandler(tag)"
      >{{ tag.name }}</span>
    </div>
    <div class="oi-view-header">
      <VuiFlex spacing="10px">
        <div>Results: {{ state.results }}</div>
        <div class="vui-flex-empty" />
        <OiIcon
          v-model="state.viewType"
          name="grid"
          hover
          tooltip="Grid view"
        />
        <OiIcon
          v-model="state.viewType"
          name="thumb"
          hover
          tooltip="Thumb view"
        />
      </VuiFlex>
    </div>
    <div class="oi-view-body vui-flex-auto">
      <div class="oi-grid oi-finder-grid" />
      <div
        ref="thumb"
        class="oi-finder-thumb"
      >
        <div class="oi-thumb-icons" />
        <div
          v-if="thumbIcons.length"
          class="oi-thumb-more"
          @click="renderThumbIcons()"
        >
          Show More {{ thumbIcons.length }}
        </div>
      </div>
    </div>
  </VuiFlex>
</template>
<style lang="scss">
.oi-pkg-title {
    text-align: center;
    font-weight: bold;
    font-size: 38px;
    padding: 15px 0 5px;
}

.oi-pkg-link {
    text-align: center;
    padding-bottom: 5px;
}

.oi-pkg-link a:link,
.oi-pkg-link a:visited {
    font-size: 16px;
    color: #666;
}

.oi-pkg-link a:hover {
    color: #0077cf;
}

.oi-pkg-stats {
    text-align: center;
    font-size: 18px;
}

.oi-pkg-stats a:link,
.oi-pkg-stats a:visited {
    font-size: 16px;
}

.oi-pkg-stats a:hover {
    color: #0077cf;
}

.oi-filter {
    text-align: center;
    margin: 0 auto;
    width: 60%;
    max-width: 500px;
    margin-top: 10px;
}

.oi-searcher {
    width: 100%;
    position: relative;

    .oi-icon {
        position: absolute;
        width: 30px;
        height: 30px;
        background-size: 30px 30px;
        right: 15px;
        top: 13px;
        opacity: 0.3;
    }
}

.oi-keywords {
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

.oi-keywords:focus {
    border: 3px solid lightblue;
}

.oi-tags {
    text-align: center;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.oi-tags span {
    margin-left: 5px;
    text-decoration: underline;
    cursor: pointer;
}

.oi-tags span:hover {
    color: #0077cf;
}

.oi-view-header {
    margin: 0 15px;
}

.oi-finder-grid {
    .oi-action-my {
        .oi-icon {
            cursor: pointer;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
}

.oi-finder-thumb {
    display: none;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #fff;
    padding: 5px;
    overflow-y: auto;

    .oi-thumb-item {
        display: block;
        float: left;
        padding: 4px;
        border: 1px solid transparent;
        cursor: pointer;
    }

    .oi-thumb-item:hover {
        border: 1px solid #ccc;
    }

    .oi-thumb-label {
        margin-top: 3px;
        white-space: nowrap;
        overflow: hidden;
        font-size: 11px;
        text-overflow: ellipsis;
        text-align: center;
    }

    .oi-thumb-icons::after {
        clear: both;
        display: block;
        content: "";
    }

    .oi-thumb-more {
        margin-top: 5px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        text-align: center;

        &:hover {
            background-color: #f5f5f5;
        }
    }
}

</style>
