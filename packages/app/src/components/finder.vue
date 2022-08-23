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
    content = content.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
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
    const grid = new Grid('.wi-grid-icons');
    grid.bind('onClick', function(e, d) {
        const rowItem = d.rowItem;
        const $target = d.e.target;
        if ($target.tagName === 'TEXTAREA') {
            $target.select();
            return;
        }
        if ($target.classList.contains('wi-icon-download')) {
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
        rowNotFound: '<div class="wi-not-found">Not found icon</div>',
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
        downloadSvg: function(v) {
            return '<wi-carbon class="wi-icon-action wi-icon-download" name="svg" size="16px" title="download svg file"></wi-carbon>';
        },
        downloadPng: function(v) {
            return '<wi-carbon class="wi-icon-action wi-icon-download" name="png" size="16px" title="download png file"></wi-carbon>';
        }
    });

    const gridData = {
        columns: [{
            id: 'icon',
            name: '',
            width: cellSize,
            minWidth: cellSize,
            align: 'center',
            classMap: 'wi-grid-icon',
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
            classMap: 'wi-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 1000
        }, {
            id: 'dataUrl',
            name: 'Data URL',
            classMap: 'wi-textarea',
            formatter: 'textarea',
            sortable: false,
            width: 260,
            maxWidth: 1000
        }, {
            id: 'wc',
            name: 'Web component',
            classMap: 'wi-textarea',
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

    console.log(list);

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
    renderGrid();
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
    <div class="wi-pkg-title">
      {{ packageInfo.name }}
    </div>
    <div class="wi-pkg-link">
      <a
        :href="packageInfo.source.url"
        target="_blank"
      >{{ packageInfo.source.name }}@{{ packageInfo.source.version }} - {{ packageInfo.source.license }}</a>
    </div>
    <div class="wi-pkg-stats">
      <b>{{ packageInfo.iconsNum }}</b> icons / size: {{ BF(packageInfo.size) }} / gzip: {{ BF(packageInfo.sizeGzip) }} / <a
        :href="'/dist/'+packageInfo.namespace+'.js'"
        target="_blank"
      >{{ packageInfo.namespace }}.js</a>
    </div>

    <div class="wi-filter flex-row">
      <div class="wi-searcher">
        <input
          v-model="keywords"
          type="text"
          class="wi-keywords flex-auto"
          onfocus="this.select()"
        >
        <div class="wi-icon wi-icon-searcher" />
      </div>
    </div>
    <div class="wi-tags">
      <span
        v-for="(tag, i) in tagsList"
        :key="i"
        @click="tagClickHandler(tag)"
      >{{ tag.name }}</span>
    </div>
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

.wi-tags {
    text-align: center;
    font-size: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.wi-tags span {
    margin-left: 5px;
    text-decoration: underline;
    cursor: pointer;
}

.wi-tags span:hover {
    color: deepskyblue;
}

.wi-tags i {
    cursor: pointer;
    width: 24px;
    height: 24px;
    margin-left: 10px;
    background-repeat: no-repeat;
    background-position: center center;
    opacity: 0.6;
}

.wi-tags i:hover {
    opacity: 1;
}

.wi-grid-icons {
    border: thin solid #ccc;
    border-radius: 5px;
    margin: 10px 10px;
}


.wi-grid-icons .tg-turbogrid .tg-cell.wi-grid-icon {
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
