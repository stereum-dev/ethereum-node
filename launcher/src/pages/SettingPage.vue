<template>
    <div class="setting-parent">
    <node-bg>
    <setting-panel></setting-panel>
    </node-bg>
    <node-header id="head"> </node-header>
    </div>
</template>
<script>
import SettingPanel from '../components/UI/setting-page/SettingPanel.vue';
export default {
  components:{SettingPanel}
}
</script>

<style scoped>
#head {
  position: fixed;
  top: 0;
}
</style>
