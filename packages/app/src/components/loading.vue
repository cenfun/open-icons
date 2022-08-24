<template>
  <div
    v-if="loading.visible"
    class="oi-loading"
  >
    <VuiFlex spacing="10px">
      <VuiLoading
        fast
        size="l"
      />
      <div>
        <div class="oi-loading-label">
          {{ loading.text }}
        </div>
        <VuiProgress
          :percentage="loading.percentage"
          height="10px"
          width="200px"
        />
        <div class="oi-loading-label">
          {{ loading.detail }}
        </div>
      </div>
    </VuiFlex>
  </div>
</template>
<script setup>
import VineUI from 'vine-ui';
import { inject } from 'vue';
const {
    VuiLoading, VuiFlex, VuiProgress
} = VineUI;

const loading = inject('loading');

</script>
<style>
.oi-loading {
    pointer-events: none;
    position: absolute;
    z-index: 100;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.oi-loading-label {
    font-size: 14px;
    white-space: nowrap;
    text-align: center;
    padding: 3px;
}
</style>
