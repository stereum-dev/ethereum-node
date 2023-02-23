<template>
  <div class="contributor-parent">
    <div v-if="crown" class="crown">
      <img src="../../../../public/img/icon/credit/crown.png" alt="crown" />
    </div>
    <div class="contributor-avatar"><img :src="avatar" /></div>
    <div class="contributor-name">
      <span>{{ name }}</span>
      <span class="rank"># {{ rank }}</span>
      <small class="score">SCORE: {{ score }} </small>
    </div>
  </div>
</template>
<script>
export default {
  props: ["name", "avatar", "crown", "rank", "score"],
};
</script>
<style scoped>
.crown {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  top: -13%;
  left: 63%;
  transform: rotatez(33deg);
  transform-origin: -55%;
}
.crown img {
  width: 70%;
}
.contributor-parent {
  display: flex;
  width: 16%;
  height: 59%;
  justify-content: center;
  align-items: center;
  border: 1px solid #343434;
  background: #2a2a2a;
  box-sizing: border-box;
  box-shadow: 1px 1px 10px 1px #171717;
  border-radius: 30px;
  flex-direction: column;
  margin-top: 2%;
  margin-bottom: 1%;
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
  width: 60%;
  height: 70%;
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
