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
  box-sizing: border-box;
  top: 30vh;
  left: auto;
  right: auto;
  margin: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  border-radius: var(--mb-0-75);
  padding: var(--mb-1);
  background-color: var(--background-grey-color);
  z-index: var(--z-fixed);
  border: none;
  resize: both;
  /*animation: modal 0.3s ease-out forwards; */
}
</style>
