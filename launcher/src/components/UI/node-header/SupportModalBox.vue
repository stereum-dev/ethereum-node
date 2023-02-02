<template>
  <div class="support-modal-box_parent" @click="cardAction">
    <div class="support-modal-box_title">
      <span>{{ boxTitle }}</span>
    </div>
    <div class="support-modal-box_image">
      <img :src="boxImagePath" alt="support photo" />
    </div>
    <div class="support-modal-box_text">
      <p>{{ boxText }}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: ["boxTitle", "boxImagePath", "boxText"],
  emit: ["card-action"],
  methods: {
    cardAction() {
      this.$emit("card-action");
    },
  },
};
</script>
<style scoped>
.support-modal-box_parent {
  width: 30%;
  height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: #2a2a2a;
  border-radius: 10px;
  border: 1px solid #343434;
  box-shadow: 1px 1px 10px 1px #171717;
  cursor: pointer;
}
.support-modal-box_parent:hover {
  background: #313131;
}
.support-modal-box_parent:active {
  box-shadow: none;
  transform: scale(0.9);
}
.support-modal-box_title {
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 800;
  color: #b0b0b0;
  text-transform: uppercase;
}
.support-modal-box_image {
  display: flex;
  width: 100%;
  height: 60%;
  justify-content: center;
  align-items: center;
}
.support-modal-box_image img {
  width: 93%;
}
.support-modal-box_text {
  width: 80%;
  height: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 53%;
  font-weight: 500;
  color: #bfbfbf;
  padding: 0;
  margin: 0;
  text-align: center;
}
</style>
