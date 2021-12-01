<template>
  <div>
    <div id="container">
      <base-logo :link="link"> </base-logo>
      <!-- <lang-dialog @click="$emit('open')" v-if="dialogIsVisible"></lang-dialog> -->
      <lang-dialog @close="hideDialog" :open="dialogIsVisible">
        <ul>
          <li v-for="link in linkFlags" :key="link" @click="hideDialog">
            <img :src="link" />
          </li>
        </ul>
      </lang-dialog>
      <section @click="showDialog">
        <lang-button :flag="flag" class="lang"></lang-button>
      </section>
    </div>
  </div>
</template>

<script>
import BaseLogo from "./BaseLogo.vue";
import LangButton from "../UI/LangButton.vue";
import LangDialog from "../UI/LangDialog.vue";
export default {
  name: "TheFirst",
  components: { BaseLogo, LangButton, LangDialog },
  name: "TheFirst",
  emit: ["open"],
  data() {
    return {
      link: "stereumLogoExtern.png",
      flag: "SelectLang.png",
      dialogIsVisible: false,
      linkFlags: ["Img/Flag/ENGLISH.png", "Img/Flag/ENGLISH.png"],
    };
  },
  methods: {
    showDialog() {
      this.dialogIsVisible = true;
    },

    hideDialog() {
      this.dialogIsVisible = false;
    },
  },
};
</script>

<style scoped>
#container {
  border-radius: 40px;

  padding: 1rem;
  margin: 2rem auto;
  width: 95vw;
  height: 95vh;
  background-color: #336666;
}
div {
  background-color: #000;

  justify-content: center;
  align-items: center;
  height: 100vh;
  display: flex;
}
.lang {
  position: fixed;
  top: 81vh;
  left: 86%;
  width: 4em;
  z-index: 100;
  resize: both;
}
</style>
