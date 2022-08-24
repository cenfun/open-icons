<script setup>
import VineUI from 'vine-ui';
import { Grid } from 'turbogrid';
import { saveAs } from 'file-saver';
import {
    inject, nextTick, ref, watch
} from 'vue';
import { BF, throttle } from '../util/util.js';

const { VuiFlex } = VineUI;

const props = defineProps({
    packageName: {
        type: String,
        default: ''
    }
});

const state = inject('state');
const settings = inject('settings');
const myIcons = inject('myIcons');
const packageInfo = ref(null);
const tagsList = ref([]);

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

// const copyContent = function(content) {
//     navigator.clipboard.writeText(content);
// };

const savePNG = function(content, name) {

    const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;

    const size = parseInt(settings.size);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.style.cssText = 'position:absolute;top:0;right:0;';
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    const img = document.createElement('img');
    img.width = size;
    img.height = size;
    img.src = dataUrl;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
        document.body.removeChild(img);
        canvas.toBlob(function(blob) {
            saveAs(blob, `${name}.png`);
            document.body.removeChild(canvas);
        });
    };
    document.body.appendChild(img);

};

const saveSVG = function(content, name) {
    const blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
    });
    saveAs(blob, `${name}.svg`);
};

const getColor = function(colorIndex) {

    const color = settings.color;

    if (color === 'rainbow') {
        const colors = [
            'orangered',
            'orange',
            'green',
            'deepskyblue',
            'royalblue',
            'darkorchid'
        ];
        const index = colorIndex % colors.length;
        return colors[index];
    }

    if (color === 'custom') {
        return settings.colorCustom;
    }

    return color;
};

const getBG = () => {
    const bg = settings.bg;
    if (bg === 'custom') {
        return settings.bgCustom;
    }
    return bg;
};

const getIcon = function(r) {
    const color = getColor(r.tg_index);
    const bg = getBG();
    const tag = r.tagName;
    return `<${tag} name="${r.name}" size="${settings.size}" color="${color}" bg="${bg}" radius="${settings.radius}"></${tag}>`;
};

const addIcon = function(icon, $target) {
    myIcons.icons.push(icon.name);
    $target.classList.remove('oi-icon-add');
    $target.classList.add('oi-icon-ok');
};

const createGrid = () => {
    const grid = new Grid('.oi-finder-grid');
    grid.bind('onClick', function(e, d) {
        const rowItem = d.rowItem;
        const $target = d.e.target;
        if ($target.tagName === 'TEXTAREA') {
            $target.select();
            return;
        }
        if ($target.classList.contains('oi-icon-add')) {
            addIcon(rowItem, $target);
            return;
        }
        if ($target.classList.contains('oi-icon-download')) {
            const type = $target.getAttribute('name');
            if (type === 'png') {
                savePNG(rowItem.svg, rowItem.name);
                return;
            }
            saveSVG(rowItem.svg, rowItem.name);
        }
    });
    state.iconsGrid = grid;
    return grid;
};

const renderGrid = () => {
    let grid = state.iconsGrid;

    if (!grid) {
        grid = createGrid();
    }

    const cellSize = parseInt(settings.size) + 10;

    grid.setOption({
        rowHeight: cellSize,
        frozenColumn: 1,
        rowNotFound: '<div class="oi-not-found">Not found icon</div>',
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

    grid.setFormatter({
        icon: function(v, r) {
            return getIcon(r);
        },
        my: function(value, rowItem, columnItem, cellNode) {
            const v = rowItem.name;
            let iconName = 'add';
            let tooltip = `Add '${v}' to my icons`;
            if (myIcons.icons.includes(v)) {
                iconName = 'ok';
                tooltip = `'${v}' already in my icons`;
            }
            const icon = `<div class="oi-action-my oi-icon oi-icon-${iconName}" tooltip="${tooltip}"></div>`;
            return icon;
        },
        textarea: function(v, r, c) {
            if (c.id === 'svg') {
                return `<textarea spellcheck="false">${v}</textarea>`;
            }
            if (c.id === 'dataUrl') {
                const content = r.svg;
                const dataUrl = `data:image/svg+xml;charset=utf8,${encodeURIComponent(content)}`;
                return `<textarea spellcheck="false">${dataUrl}</textarea>`;
            }
            return `<textarea spellcheck="false">${this.getFormatter('icon')(v, r)}</textarea>`;
        },
        download: function(v) {
            return `
                <div class="oi-action-downloads vui-flex-row">
                    <div class="oi-icon-download" name="svg" title="download svg file">SVG</div>
                    <div class="oi-icon-download" name="png" title="download png file">PNG</div>
                <div>
            `;
        }
    });

    const gridData = {
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
            id: 'my',
            name: '<div class="oi-icon oi-icon-my"></div>',
            width: 30,
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
            width: 260,
            maxWidth: 1000
        }, {
            id: 'dataUrl',
            name: 'Data URL',
            classMap: 'oi-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 1000
        }, {
            id: 'wc',
            name: 'Web component',
            classMap: 'oi-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 500
        }, {
            id: 'packageName',
            name: 'Package',
            align: 'center'
        }],
        rows: state.icons
    };

    grid.setData(gridData);

    grid.render();

};

const updateGrid = () => {
    const grid = state.iconsGrid;
    if (grid) {
        grid.update();
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

watch(() => props.packageName, (v) => {
    render();
});

watch(settings, () => {
    const grid = state.iconsGrid;
    if (grid) {
        renderGridAsync();
    }
});

watch(keywords, () => {
    updateGrid();
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
      <b>{{ packageInfo.iconsNum }}</b> icons / size: {{ BF(packageInfo.size) }} / gzip: {{ BF(packageInfo.sizeGzip) }} / <a
        :href="'/dist/'+packageInfo.namespace+'.js'"
        target="_blank"
      >{{ packageInfo.namespace }}.js</a>
    </div>

    <div class="oi-filter flex-row">
      <div class="oi-searcher">
        <input
          v-model="keywords"
          type="text"
          class="oi-keywords flex-auto"
          onfocus="this.select()"
        >
        <div class="oi-icon oi-icon-searcher" />
      </div>
    </div>
    <div class="oi-tags">
      <span
        v-for="(tag, i) in tagsList"
        :key="i"
        @click="tagClickHandler(tag)"
      >{{ tag.name }}</span>
    </div>
    <div class="oi-finder-grid vui-flex-auto" />
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

    .oi-icon-searcher {
        position: absolute;
        width: 30px;
        height: 30px;
        background-size: 30px 30px;
        right: 15px;
        top: 13px;
        opacity: 0.3;
        pointer-events: none;
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
    color: deepskyblue;
}

.oi-finder-grid {
    border: thin solid #ccc;
    border-radius: 5px;
    margin: 10px;

    .oi-action-my {
        cursor: pointer;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    .oi-not-found {
        font-size: 20px;
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

</style>
