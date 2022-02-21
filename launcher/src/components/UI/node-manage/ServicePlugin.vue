<template>
  <div class="service-container">
    <img
      class="service-arrow"
      src="../../../../public/Img/icon/manage-node-icons/up-arrow.png"
      alt="icon"
    />
    <div class="service-bg">
      <div
        draggable="true"
        @dragstart="startDrag($event, item)"
        v-for="item in servicePlugins"
        :key="item.id"
        :class="{ 'chosen-plugin': item.active }"
        class="service-item"
        @click="item.active = !item.active"
      >
        <img :src="item.source" alt="icon" />
      </div>
    </div>
    <img
      class="service-arrow"
      src="../../../../public/Img/icon/manage-node-icons/down-arrow.png"
      alt="icon"
    />
  </div>
</template>
<script>
export default {
  props: ["servicePlugins","consensusItems"],
  methods: {
    startDrag(event, item) {
      console.log(item);
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("itemId", item.id);
    },
    onDrop(event, list) {
      const itemId = event.dataTransfer.getData("itemId");
      const item = { ...list.find((item) => item.id == itemId) };
      this.consensusItems.push(item);
    },
  },
};
</script>
<style scoped>
.service-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 95%;
  height: 95%;
  margin-bottom: 10px;
  background: #4f4f4f;
  align-self: center;
  border-radius: 20px;
  overflow: hidden;
  padding: 5px;
  box-sizing: border-box;
}
.service-bg {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: repeat(4, 22%);
  align-items: center;
  justify-items: center;
  padding-top: 20px;
  width: 90%;
  height: 80%;
  overflow-x: hidden;
  overflow-y: auto;
  background: #707070;
  border-radius: 20px;
  gap: 3px;
}
.service-arrow {
  width: 50%;
}
.service-item {
  width: 60px;
  height: 60px;
  border: 2px solid gray;
  border-radius: 13px;
}
.service-item img {
  width: 60px;
  height: 60px;
  border-radius: 13px;
  box-shadow: 1px 1px 5px 1px rgb(132, 130, 130);
}
.service-item img:active {
  box-shadow: none;
}
.chosen-plugin {
  border: 2px solid rgb(86, 172, 138);
  border-radius: 13px;
}
/* .btn {
  width: 90%;
  margin: 3%;
  height: 5%;
  display: flex;
  justify-content: center;
  align-self: center;
  overflow: hidden;
} */
.arrow-up {
  width: 0;
  height: 50%;
  border-bottom: solid 0.5rem #eee;
  border-left: solid 50px transparent;
  border-right: solid 50px transparent;
  resize: both;
}
.arrow-down {
  width: 0;
  height: 50%;
  border-top: solid 0.5rem #eee;
  border-left: solid 50px transparent;
  border-right: solid 50px transparent;
}
</style>
