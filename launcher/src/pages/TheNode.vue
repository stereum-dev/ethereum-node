<template>
    <section id="parent">
        <node-bg>
            <node-grid></node-grid>
        </node-bg>
    
        <node-header id="head"></node-header>
    
    </section>
</template>

<script>
import NodeGrid from '../components/UI/NodeGrid.vue';
export default {

    components: { NodeGrid }
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
</style>
