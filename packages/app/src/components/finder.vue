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
            window.saveAs(blob, `${name}.png`);
            document.body.removeChild(canvas);
        });
    };
    document.body.appendChild(img);

};

const saveSVG = function(content, name) {
    const blob = new Blob([content], {
        type: 'text/plain;charset=utf-8'
    });
    window.saveAs(blob, `${name}.svg`);
};

const createGrid = () => {
    const grid = new Grid('.wci-finder-grid');
    grid.bind('onClick', function(e, d) {
        const rowItem = d.rowItem;
        const $target = d.e.target;
        if ($target.tagName === 'TEXTAREA') {
            $target.select();
            return;
        }
        if ($target.classList.contains('wci-icon-download')) {
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

const getColor = function(c, colorIndex) {
    const colors = [
        'orangered',
        'orange',
        'green',
        'deepskyblue',
        'royalblue',
        'darkorchid'
    ];

    if (c === 'rainbow') {
        const index = colorIndex % colors.length;
        c = colors[index];
        colorIndex += 1;
    }

    return c;
};

const getIcon = function(r) {
    const c = getColor(settings.color, r.tg_index);
    const tag = r.tagName;
    return `<${tag} name="${r.name}" size="${settings.size}" color="${c}" background="${settings.bg}" radius="${settings.radius}"></${tag}>`;
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
        rowNotFound: '<div class="wci-not-found">Not found icon</div>',
        rowFilter: rowFilter,
        selectVisible: true,
        selectAllVisible: false,
        rowNumberVisible: true,
        rowNumberWidth: 52,
        scrollbarRound: true,
        bindWindowResize: true,
        bindContainerResize: true
    });

    grid.setFormatter({
        icon: function(v, r) {
            return getIcon(r);
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
                <div class="wci-download-icons vui-flex-row">
                    <div class="wci-icon-action wci-icon-download" name="svg" title="download svg file">SVG</div>
                    <div class="wci-icon-action wci-icon-download" name="png" title="download png file">PNG</div>
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
            classMap: 'wci-grid-icon',
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
            resizable: false,
            width: 80
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

const renderTags = () => {

    const tags = packageInfo.value.tags;
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

    packageInfo.value = pkg;

    nextTick(() => {
        renderGrid();
        renderTags();
    });

};


watch(() => props.packageName, (v) => {
    render();
});

watch(settings, () => {
    const grid = state.iconsGrid;
    if (grid) {
        renderGrid();
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
    <div class="wci-pkg-title">
      {{ packageInfo.fullName || packageInfo.name }}
    </div>
    <div class="wci-pkg-link">
      <a
        :href="packageInfo.source.url"
        target="_blank"
      >{{ packageInfo.source.name }}@{{ packageInfo.source.version }} - {{ packageInfo.source.license }}</a>
    </div>
    <div class="wci-pkg-stats">
      <b>{{ packageInfo.iconsNum }}</b> icons / size: {{ BF(packageInfo.size) }} / gzip: {{ BF(packageInfo.sizeGzip) }} / <a
        :href="'/dist/'+packageInfo.namespace+'.js'"
        target="_blank"
      >{{ packageInfo.namespace }}.js</a>
    </div>

    <div class="wci-filter flex-row">
      <div class="wci-searcher">
        <input
          v-model="keywords"
          type="text"
          class="wci-keywords flex-auto"
          onfocus="this.select()"
        >
        <div class="wci-icon wci-icon-searcher" />
      </div>
    </div>
    <div class="wci-tags">
      <span
        v-for="(tag, i) in tagsList"
        :key="i"
        @click="tagClickHandler(tag)"
      >{{ tag.name }}</span>
    </div>
    <div class="wci-finder-grid vui-flex-auto" />
  </VuiFlex>
</template>
<style lang="scss">
.wci-pkg-title {
    text-align: center;
    font-weight: bold;
    font-size: 38px;
    padding: 15px 0 5px;
}

.wci-pkg-link {
    text-align: center;
    padding-bottom: 5px;
}

.wci-pkg-link a:link,
.wci-pkg-link a:visited {
    font-size: 16px;
    color: #666;
}

.wci-pkg-link a:hover {
    color: #0077cf;
}

.wci-pkg-stats {
    text-align: center;
    font-size: 18px;
}

.wci-pkg-stats a:link,
.wci-pkg-stats a:visited {
    font-size: 16px;
}

.wci-pkg-stats a:hover {
    color: #0077cf;
}

.wci-filter {
    text-align: center;
    margin: 0 auto;
    width: 60%;
    max-width: 500px;
    margin-top: 10px;
}

.wci-searcher {
    width: 100%;
    position: relative;

    .wci-icon-searcher {
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

.wci-keywords {
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

.wci-keywords:focus {
    border: 3px solid lightblue;
}

.wci-tags {
    text-align: center;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.wci-tags span {
    margin-left: 5px;
    text-decoration: underline;
    cursor: pointer;
}

.wci-tags span:hover {
    color: deepskyblue;
}

.wci-finder-grid {
    border: thin solid #ccc;
    border-radius: 5px;
    margin: 10px;
}

.wci-finder-grid .wci-not-found {
    font-size: 20px;
}

.wci-finder-grid .tg-turbogrid .tg-cell.wci-grid-icon {
    padding: 4px;
    border-left: thin solid #e5e5e5;
    border-right: thin solid #e5e5e5;
}

.wci-finder-grid .tg-turbogrid .tg-cell.wci-textarea {
    padding: 3px 5px;
}

.wci-finder-grid .tg-turbogrid .tg-cell.wci-textarea textarea {
    width: 100%;
    height: 100%;
    resize: none;
}

.wci-icon-action {
    font-family: Menlo, Consolas, monospace;
    font-weight: bold;
    cursor: pointer;
    opacity: 0.6;

    &:first-child {
        margin-right: 10px;
    }
}

.wci-icon-action:hover {
    opacity: 1;
    text-decoration: underline;
}

.wci-download-icons {
    align-items: center;
    height: 100%;
}

</style>
