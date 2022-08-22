<script setup>
import VineUI from 'vine-ui';
import {
    inject, ref, watch
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

const item = ref(null);

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

    console.log(pkg);

    item.value = pkg;

};


watch(() => props.packageName, (v) => {
    render();
});

</script>
<template>
  <VuiFlex
    v-if="item"
    direction="column"
    height="100%"
  >
    <div class="wi-pkg-info">
      <div class="wi-pkg-title">
        {{ item.name }}
      </div>
      <div class="wi-pkg-link">
        From <a
          :href="item.source.url"
          target="_blank"
        >{{ item.source.name }}@{{ item.source.version }} - {{ item.source.license }}</a>
      </div>
      <div class="wi-pkg-stats">
        <b>{{ item.iconsNum.toLocaleString() }}</b> icons / size: {{ BF(item.size) }} / gzip: {{ BF(item.sizeGzip) }} / <a
          :href="'/dist/'+item.namespace+'.js'"
          target="_blank"
        >{{ item.namespace }}.js</a>
      </div>
    </div>
    <div class="wi-finder">
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
      <div class="wi-grid flex-auto" />
    </div>
  </VuiFlex>
</template>
<style lang="scss">

.wi-pkg-info {
    position: relative;
    padding-bottom: 10px;
}

.wi-pkg-title {
    text-align: center;
    font-weight: bold;
    font-size: 35px;
    padding: 15px;
}

.wi-pkg-link {
    margin-bottom: 15px;
    text-align: center;
}

.wi-pkg-link a:link,
.wi-pkg-link a:visited {
    margin-top: 8px;
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


.wi-finder {
    height: 100%;
}

.wi-filter {
    text-align: center;
    margin: 0 auto;
    width: 60%;
    max-width: 600px;
}

.wi-searcher {
    width: 100%;
    position: relative;
}

.wi-keywords {
    border: 2px solid transparent;
    border-radius: 10px;
    padding: 10px 45px 10px 15px;
    background-color: #eee;
    height: 32px;
    line-height: 32px;
    outline: none;
    font-size: 18px;
    box-sizing: content-box;
    display: block;
    width: calc(100% - 60px);
}

.wi-keywords:focus {
    border: 2px solid lightblue;
}

.wi-searcher-icon {
    position: absolute;
    right: 10px;
    top: 13px;
    opacity: 0.3;
}

.wi-popular {
    margin: 10px 0;
    text-align: center;
    height: 35px;
    line-height: 35px;
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


.wi-grid .tg-turbogrid .tg-cell.wi-icon {
    padding: 4px;
    border-left: thin solid #e5e5e5;
    border-right: thin solid #e5e5e5;
}

.wi-grid .tg-turbogrid .tg-cell.wi-textarea {
    padding: 3px 5px;
}

.wi-grid .tg-turbogrid .tg-cell.wi-textarea textarea {
    width: 100%;
    height: 100%;
    resize: none;
    font-family: monaco, sans-serif;
}

.wi-grid .wi-icon-action {
    cursor: pointer;
    opacity: 0.6;
}

.wi-grid .wi-icon-action:hover {
    opacity: 1;
}

.wi-grid .tg-turbogrid .tg-cell .wi-icon-action {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.wi-grid .wi-not-found {
    font-size: 20px;
}


</style>
