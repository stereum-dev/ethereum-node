<template>
  <div class="btn-box-parent">
    <div v-if="!deleteKey" class="wrapper">
      <div class="btn-del" @click="deleteKeySwitch">
        <img src="/img/icon/access-management/OPEN_TRASH_ICON.png" alt="" />
      </div>
    </div>
    <div v-else class="wrapper">
      <div class="btn-del close" @click="cancelDelete">
        <img src="/img/icon/access-management/close.png" alt="" />
      </div>
      <div class="btn-del done" @click="confirmDelete">
        <img src="/img/icon/access-management/done.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emit: ["delete-key", "are-you-sure", "cancel-delete"],
  data() {
    return {
      deleteKey: false,
    };
  },

  methods: {
    deleteKeySwitch() {
      this.deleteKey = true;
      this.$emit("are-you-sure");
    },
    cancelDelete() {
      this.deleteKey = false;
      this.$emit("cancel-delete");
    },
    confirmDelete() {
      this.$emit("delete-key");
    },
  },
};
</script>

<style scoped>
.btn-box-parent {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
}
.btn-del {
  width: 42%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid #ff002a;
  border-radius: 5px;
  background: #601616;
}
.btn-del img {
  width: 45%;
}
.close img {
  width: 85%;
}
.done img {
  width: 85%;
}
.done {
  border: 1px solid #3ac4c4;
  background: #336666;
}
.btn-del:active {
  transform: scale(0.92);
}
</style>
