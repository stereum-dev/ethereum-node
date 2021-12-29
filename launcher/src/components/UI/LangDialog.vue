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
  position: fixed;
  box-sizing: border-box;
  top: 30vh;

  
  min-width: 20rem;

}
</style>