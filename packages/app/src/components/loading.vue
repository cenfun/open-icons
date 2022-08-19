<template>
  <div
    v-if="props.visible"
    class="wi-loading"
  >
    <VuiFlex spacing="10px">
      <VuiLoading fast />
      <div class="wi-loading-label">
        {{ props.text }}
      </div>
    </VuiFlex>
  </div>
</template>
<script setup>
import VineUI from 'vine-ui';
const { VuiLoading, VuiFlex } = VineUI;

const props = defineProps({
    visible: {
        type: Boolean,
        default: true
    },
    text: {
        type: String,
        default: 'Loading ...'
    }
});

</script>
<style>
.wi-loading {
    pointer-events: none;
    position: absolute;
    z-index: 100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.wi-loading-label {
    font-size: 14px;
    width: 70px;
    white-space: nowrap;
}
</style>
