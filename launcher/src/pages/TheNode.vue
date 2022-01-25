<template>
  <section id="parent">
    <node-bg> </node-bg>
    <node-header id="head"></node-header>
    <right-node >baraye test </right-node>
    <service-plugin></service-plugin>
  </section>
</template>

<script>
import RightNode from "../components/UI/RightNode.vue";
import ServicePlugin from '../components/UI/ServicePlugin.vue';
export default {
  components: { RightNode,ServicePlugin },
};
</script>

<style scoped>
#parent {
 
  box-sizing: border-box;
  padding: 0;
}

#head {
  position: fixed;
  top: 0;
  
}


/*baraye test*/
</style>
