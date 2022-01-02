<template>
  <section>
    <section id="header">
      <h2>welcome</h2>
    </section>
    <div class="container">
      <div class="col" v-for="install in installation" :key="install.title">
        <button-installation
          :title="install.title"
          :img="install.img"
        ></button-installation>
      </div>
    </div>
    <circle-loading open="true"></circle-loading>
    <div class="txt">
      <p class="help">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Temporibus adipisci id
        mollitia culpa? Distinctio dolores error commodi cupiditate quam ipsam
        consequuntur aut iste praesentium voluptates, recusandae quae, alias fugiat quod
        pariatur quidem. Nisi explicabo modi illum ut, maxime soluta earum!
      </p>
    </div>
  </section>
</template>
<script>
import ButtonInstallation from "./ButtonInstallation.vue";
import CircleLoading from "../UI/CircleLoading.vue";
export default {
  components: { ButtonInstallation, CircleLoading },
  data() {
    return {
      installation: [
        { title: "1CLICK INSTALLATION", img: "/img/icon/clickinstall.png" },
        { title: "CUSTOM INSTALLATION", img: "/img/icon/custominstall.png" },
        { title: "IMPORT CONFIGURATION", img: "/img/icon/one click installer.png" },
      ],
    };
  },
};
</script>
<style scope>
.container {
  width: 72vw;
  height: 30vh;
  resize: both;
  margin: 0 auto;
  position: relative;
  border-radius: 40px;
}
.col {
  width: 25%;
  height: 22vh;
  background: rgba(51, 102, 102, 0.4);
  float: left;
  border: 3px solid grey;
  resize: both;
  margin: 25px;
  border-radius: 20px;
}
#header {
  text-align: center;
  margin: 1rem auto;
  margin-top: 1.7rem;
  max-width: 15rem;
  border-radius: 40px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26); */
  padding: 0.1rem;
  background: rgba(51, 102, 102, 0.7);
  color: #fff;
  border: 3px solid rgb(88, 86, 86);
  position: relative;
  resize: both;
}
#header h2 {
  margin: 12px auto;
  font-size: 20pt;
  resize: both;
}
.txt {
  width: 70vw;
  height: 8vh;
  border: 3px solid grey;
  margin: 100px auto;
  background: rgba(51, 102, 102, 0.4);
  border-radius: 40px;
  position: relative;
  padding: 5px;
  resize: both;
}
.help {
  margin-top: -1px;
  font-size: 10pt;
  font-weight: bold;
  color: #fff;
}
.headCol {
  text-align: center;
  width: 98%;
  border: 3px solid red;
  border-radius: 40px;
}
</style>
