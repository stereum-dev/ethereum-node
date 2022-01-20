<template>
  <section id="parent">
    <node-bg> </node-bg>
    <node-header id="head"></node-header>
    <right-node > TEST</right-node>
  </section>
</template>

<script>
import RightNode from "../components/UI/RightNode.vue";
export default {
  components: { RightNode },
};
</script>

<style scoped>
#parent {
  position: relative;
  box-sizing: border-box;
}

#head {
  position: absolute;
  top: 0;
}


/*baraye test*/
</style>
