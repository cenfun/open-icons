<script setup>
import VineUI from 'vine-ui';
import { inject } from 'vue';

const { VuiFlex, VuiSelect } = VineUI;

const settings = inject('settings');

</script>
<template>
  <VuiFlex
    spacing="10px"
    class="wci-settings"
  >
    <VuiSelect
      v-model="settings.size"
      label="Size"
    >
      <option>16px</option>
      <option>24px</option>
      <option>32px</option>
      <option>48px</option>
      <option>64px</option>
      <option>96px</option>
      <option>128px</option>
      <option>256px</option>
    </VuiSelect>
    <VuiSelect
      v-model="settings.color"
      label="Color"
    >
      <option />
      <option>rainbow</option>
      <option>orangered</option>
      <option>orange</option>
      <option>green</option>
      <option>deepskyblue</option>
      <option>royalblue</option>
      <option>darkorchid</option>
    </VuiSelect>
    <VuiSelect
      v-model="settings.bg"
      label="BG"
    >
      <option />
      <option>#eee</option>
      <option>#fff</option>
      <option>#ccc</option>
      <option>#000</option>
    </VuiSelect>
    <VuiSelect
      v-model="settings.radius"
      label="Radius"
    >
      <option />
      <option>5px</option>
      <option>10px</option>
      <option>20%</option>
      <option>50%</option>
    </VuiSelect>
  </VuiFlex>
</template>
<style lang="scss">
.wci-settings {
    height: 35px;
    padding-right: 5px;
}
</style>
