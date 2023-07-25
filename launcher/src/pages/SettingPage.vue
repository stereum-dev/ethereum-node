<template>
  <div class="setting-parent">
    <node-bg>
      <setting-panel></setting-panel>
    </node-bg>
    <TheFooter />
    <task-manager />
    <node-header id="head"> </node-header>
  </div>
</template>
<script>
import TheFooter from "../components/layers/TheFooter.vue";
import TaskManager from "../components/UI/task-manager/TaskManager.vue";
import SettingPanel from "../components/UI/setting-page/SettingPanel.vue";
export default {
  components: { SettingPanel, TheFooter, TaskManager },
};
</script>

<style scoped>
#head {
  position: fixed;
  top: 0;
}
</style>
