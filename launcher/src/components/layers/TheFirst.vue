<template>
    <div>

        <div id="container">
          <section @click="activePage">
            <base-logo :link='link' >
            </base-logo> 
          </section>
        <!-- <lang-dialog @click="$emit('open')" v-if="dialogIsVisible"></lang-dialog> -->
        <lang-dialog @close="hideDialog" :open="dialogIsVisible" class="lDialog">
          <ul id="flag">
            <li v-for="link in linkFlags" :key="link.langImg" @click="setLang(link.langName,link.langSelect)">
              <img :src="link.langImg" id="flagId" />
            </li>
          </ul>
    
        </lang-dialog>
        <section  @click="showDialog">     
          <lang-button :flag="flag" class="lang" ></lang-button>
        </section>

        </div>
    </div>
</template>

<script>
import BaseLogo from './BaseLogo.vue';
import LangButton from '../UI/LangButton.vue';
import LangDialog from '../UI/LangDialog.vue';
import SetupServer from '../layers/SetupServer.vue'
export default {
    name:"TheFirst",
  components: { BaseLogo,LangButton,LangDialog,SetupServer },
    name:"TheFirst",
    emit:['open','page'],
    data(){
        return{
            link:'stereumLogoExtern.png',
            flag:'SelectLang.png',
          dialogIsVisible: false,
          linkFlags:[{langImg:'Img/Flag/ENGLISH.png',langSelect:'Img/Flag/En.png',langName:'english'},{langImg:'Img/Flag/GERMAN.png',langSelect:'Img/Flag/Gr.png',langName:'german'},{langImg:'Img/Flag/FRENCH.png',langSelect:'Img/Flag/Fr.png',langName:'french'},{langImg:'Img/Flag/SPANISH.png',langSelect:'Img/Flag/Sp.png',langName:'spanish'}],
          language:''
          

        }
    },
    methods: {
        showDialog() {
      this.dialogIsVisible = true;
    },
    
    hideDialog() {
      this.dialogIsVisible = false;
      
    },
  setLang(lang,langSelect){
    this.language=lang
    this.flag=langSelect
    this.hideDialog()
    this.link='stereum_logo_extern.png'
  },
  activePage(){
    if(this.language===''){}else{
      this.$emit('page','SetupServer')

}
  }

    },

}
</script>

<style scoped>
#container {
  border-radius: var(--mb-1-5);;

  padding: var(--mb-1);
  margin: var(--mb-2) auto;
  width: 95vw;
  height: 95vh;
}
div {
  background-color: var(--body-color);
  justify-content: center;
  align-items: center;
  height: 100vh;
  display: flex;
}
.lang{
  position: fixed;
  top: 81vh;
  left: 86vw;
  width: var(--mb-2);
  z-index: var(--z-fixed);
}
#flag{
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
  padding: var(--mb-0-25);
}
#flagId {
  width:120px ;
  resize: both;
}
@keyframes blink {
  from {
    background-color: var(--first-color-second);
  }
  to {
    background-color: var(--container-color);
  }
}


</style>
        