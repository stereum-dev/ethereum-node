<template>
  <div>
    <div id="container">
      <section @click="activePage">
        <base-logo :link="link"> </base-logo>
      </section>
      <!-- <lang-dialog @click="$emit('open')" v-if="dialogIsVisible"></lang-dialog> -->
      <lang-dialog @close="hideDialog" :open="dialogIsVisible" class="lDialog">
        <ul id="flag">
          <li
            v-for="link in linkFlags"
            :key="link.langImg"
            @click="setLang(link.langName, link.langSelect)"
          >
            <img :src="link.langImg" id="flagId" />
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
      linkFlags: [
        {
          langImg: "Img/Flag/ENGLISH.png",
          langSelect: "Img/Flag/En.png",
          langName: "english",
        },
        {
          langImg: "Img/Flag/GERMAN.png",
          langSelect: "Img/Flag/Gr.png",
          langName: "german",
        },
        {
          langImg: "Img/Flag/FRENCH.png",
          langSelect: "Img/Flag/Fr.png",
          langName: "french",
        },
        {
          langImg: "Img/Flag/SPANISH.png",
          langSelect: "Img/Flag/Sp.png",
          langName: "spanish",
        },
      ],
      language: "",
    };
  },
  methods: {
    showDialog() {
      this.dialogIsVisible = true;
    },

    hideDialog() {
      this.dialogIsVisible = false;
    },
    setLang(lang, langSelect) {
      this.language = lang;
      this.flag = langSelect;
      this.hideDialog();
      this.link = "stereum_logo_extern.png";
    },
    activePage() {
      if (this.language === "") {
      } else {
        alert("");
      }
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
  animation: blink 1s 1000000 alternate;
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
#flag {
  display: inline-flex;
  margin: 0;
  padding: 0;
  /* width: 100px; */
  text-align: left;
  float: left;
}
#flag li {
  list-style: none;
  display: inline-block;
  padding: 5px;
}
#flagId {
  width: 120px;
  resize: both;
}
@keyframes blink {
  from {
    background-color: #336666;
  }
  to {
    background-color: #448a8a;
  }
}
</style>
