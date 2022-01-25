<template>
  <section id="parent">
    <node-bg><footer-node></footer-node> </node-bg>
    <node-header id="head"></node-header>
    <right-node>baraye test </right-node>
    <service-plugin></service-plugin>
    <!-- <footer-node></footer-node> -->
    <the-trapezium></the-trapezium>
  </section>
</template>

<script>
import TheTrapezium from '../components/UI/TheTrapezium.vue'
import FooterNode from '../components/layers/FooterNode.vue';
import RightNode from "../components/UI/RightNode.vue";
import ServicePlugin from "../components/UI/ServicePlugin.vue";
export default {
  components: { RightNode, ServicePlugin, FooterNode,TheTrapezium },
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
