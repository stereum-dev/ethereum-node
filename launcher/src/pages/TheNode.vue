<template>
  <section id="parent">
    <node-bg><right-node id="sider"></right-node></node-bg><node-header id="head"></node-header>
  </section>
</template>

<script>
import RightNode from '../components/UI/RightNode.vue';
export default {
  components:{RightNode}
}
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
#sider{
  position: absolute;
  right: 0;
  top: 0;
}
</style>
