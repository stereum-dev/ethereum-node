<template>
  <section @click="setClickId">
    <div id="title">
      <p>{{ title }}</p>
    </div>
    <div id="img">
      <img :src="img" />
    </div>
  </section>
</template>
<script>
export default {
  name: "ButtonInstallation",
  props: ["title", "img",'id'],
  emits:['clickId'],
  data(){return{
    clickId:null
  }},
  methods:{
    setClickId(){
      this.clickId=this.id
      this.$emit('clickId',this.clickId);
    }
  }
};
</script>
<style scoped>
#title {
  border: 3px solid grey;
  width: 97%;
  text-align: center;
  border-radius: 50px;
  padding: 0;
  background: rgba(51, 102, 102, 1);
  height: auto;
}
#title p {
  margin: 1px;
  font-size: 10pt;
  color: #eee;
  font-weight: bold;

  margin: 1px;
  border-radius: 40px;
}
#img img {
  width: 95%;
  margin-top: 5pt;
  resize: both;
  cursor: pointer;
}
</style>
