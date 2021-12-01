<template>
  <dialog open v-if="open">
    <!-- @link="setLink" -->
    <slot></slot>
  </dialog>
</template>

<script>
export default {
  name: "LangDialog",
  props: ["open"],
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
};
</script>

<style scoped>
dialog {
  position: fixed;
  top: 30vh;
  width: 30rem;
  left: calc(50% - 15rem);
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: 12px;
  padding: 1rem;
  background-color: white;
  z-index: 100;
  border: none;
  /* animation: modal 0.3s ease-out forwards; */
}
</style>
