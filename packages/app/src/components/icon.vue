<template>
  <div
    ref="el"
    :class="classList"
    :style="styleList"
    @click="clickHandler"
  />
</template>

<script setup>
import {
    computed, onMounted, ref
} from 'vue';

const context = require.context('../images', true, /\.svg$/);
const paths = context.keys();
// console.log(paths);

const svgMap = {};
paths.forEach((path) => {
    const file = path.toLowerCase().split('/').pop();
    const name = file.substring(0, file.length - 4);
    svgMap[name] = {
        raw: context(path)
    };
});

// console.log(svgMap);

const props = defineProps({
    name: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: ''
    },
    size: {
        type: String,
        default: ''
    },
    hover: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        default: null
    }
});

const emit = defineEmits(['update:modelValue']);

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
    if (props.modelValue !== null) {
        ls.push('oi-icon-selectable');
    }
    if (props.modelValue === props.name) {
        ls.push('oi-icon-selected');
    }
    return ls;
});

const styleList = computed(() => {
    const st = {};
    if (props.size) {
        st.size = props.size;
    }
    if (props.color) {
        st.color = props.color;
    }
    return st;
});

const clickHandler = (e) => {
    emit('update:modelValue', props.name);
};

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

<style lang="scss">
.oi-icon {
    --oi-icon-size: 20px;

    display: block;
    width: var(--oi-icon-size);
    height: var(--oi-icon-size);
    overflow: hidden;

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

.oi-icon-selectable {
    padding: 1px;
    border: thin solid transparent;
    cursor: pointer;
}

.oi-icon-selected {
    color: #006797;
    border: thin solid #26a0da;
    background-color: #cbe8f6;
}

</style>
