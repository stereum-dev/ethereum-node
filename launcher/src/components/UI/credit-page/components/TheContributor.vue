<template>
  <div class="contributor-parent">
    <div v-if="props.crown" class="crown">
      <img src="/img/icon/credit-page-icons/crown.png" alt="crown" />
    </div>
    <div class="contributor-avatar"><img :src="props.avatar" /></div>
    <div class="contributor-name">
      <span>{{ props.name }}</span>
      <span v-if="props.rank" class="rank"># {{ props.rank }}</span>
      <small v-if="props.score" class="score">SCORE: {{ props.score }} </small>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
    default: "",
  },
  avatar: {
    type: String,
    required: true,
    default: "",
  },
  crown: {
    type: Boolean,
    required: true,
    default: false,
  },
  rank: {
    type: Number,
    required: true,
    default: null,
  },
  score: {
    type: Number,
    required: true,
    default: null,
  },
});
</script>
<style scoped>
.crown {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  top: -15%;
  left: 63%;
  transform: rotatez(38deg);
  transform-origin: -40%;
}
.crown img {
  width: 55%;
}
.contributor-parent {
  cursor: default;
  display: flex;
  width: 180px;
  height: 230px;
  justify-content: center;
  align-items: center;
  border: 1px solid #343434;
  background: #2a2a2a;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 30px;
  flex-direction: column;
  justify-self: center;
  position: relative;
}
.contributor-parent:hover {
  background: #313131;
}
.contributor-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50%;
  border-radius: 30px 30px 0 0;
}
.contributor-avatar img {
  width: 90px;
  height: 90px;
  border-radius: 40%;
}
.contributor-name {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40%;
  font-size: 100%;
  font-weight: 600;
  color: #eee;
  flex-direction: column;
}
.rank {
  font-size: 200%;
}
.score {
  font-size: 70%;
}
</style>
