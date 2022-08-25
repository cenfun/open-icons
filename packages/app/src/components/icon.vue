<script setup>
import {
    computed, onMounted, ref
} from 'vue';

const context = require.context('../images', true, /\.svg$/);
const paths = context.keys();
//console.log(paths);

const svgMap = {};
paths.forEach((path) => {
    const file = path.toLowerCase().split('/').pop();
    const name = file.substring(0, file.length - 4);
    svgMap[name] = {
        raw: context(path)
    };
});

//console.log(svgMap);

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: '20px'
    },
    hover: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const el = ref(null);

const classList = computed(() => {
    const ls = ['oi-icon'];
    if (props.name) {
        ls.push(`oi-icon-${props.name}`);
    }
    if (props.hover) {
        ls.push('oi-icon-hover');
    }
    if (props.disabled) {
        ls.push('oi-icon-disabled');
    }
    return ls;
});

const styleList = computed(() => {
    return {
        '--oi-icon-size': props.size
    };
});


onMounted(() => {
    const item = svgMap[props.name];
    if (item) {
        if (!item.svg) {
            item.svg = atob(item.raw.split('base64,').pop());
        }
        el.value.innerHTML = item.svg;
    }
});
</script>
<template>
  <div
    ref="el"
    :class="classList"
    :style="styleList"
  />
</template>
<style lang="scss">
.oi-icon {
    --oi-icon-size: 20px;

    display: block;
    overflow: hidden;
    width: var(--oi-icon-size);
    height: var(--oi-icon-size);

    svg {
        display: block;
        pointer-events: none;
    }
}

.oi-icon-hover {
    opacity: 0.6;
}

.oi-icon-hover:hover {
    opacity: 1;
}

.oi-icon-disabled,
.oi-icon-disabled:hover {
    opacity: 0.3;
}

</style>
