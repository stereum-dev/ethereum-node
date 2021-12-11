<template>
  <dialog open v-if="open">
     <!-- @link="setLink" -->
      <slot>
       
</slot>
    </dialog>
</template>

<script>
export default {
  name:'LangDialog',
   props: ['open'],
//    data(){
//      return{
//        links:''
//      }
//    },
//    methods: {
//      setLink(linkUrl){
// links=linkUrl
//      }
//    },
  

}
</script>

<style scoped>
dialog {
  position: absolute;
  top: 30vh;
  
  min-width: 20rem;
  left: auto;
  right: auto;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 20px;
  padding: 1rem;
  background-color: white;
  z-index: 100;
  border: solid 5px rgba(15, 15, 15, .5);
  /* animation: modal 0.3s ease-out forwards; */
  background-color:rgba(76, 72, 72, .5);
 resize: both;

}
</style>