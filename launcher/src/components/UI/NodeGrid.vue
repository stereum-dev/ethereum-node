<template>
    <div class="nodeparent">
        <div class="execution">execution</div>
        <div class="consensus">consensus</div>
        <div class="validator"><the-trapezium></the-trapezium></div>
        <div class="nodesetup">NODE SETUP</div>
        <div class="service">SERVICE</div>
        <div class="sidebar">SIDEBAR</div>
        <div class="footer">FOOTER</div>
    </div>
</template>

<script>
import TheTrapezium from '../UI/TheTrapezium.vue'
export default {
    components:{TheTrapezium}
}
</script>

<style scoped>
.nodeparent {
    display: grid;
    height: 93%;
    grid-template-columns: 70% 20% 10%;
    grid-template-rows: repeat(4, 23.75%) 5%;
   position: relative;
   top: 7%;
   margin: 0;
 
}

.execution {
    background: red;
    color: white;
    grid-column-start: 1;
    grid-column-end: 2;
}

.consensus {
    background: yellow;
    color: red;
    grid-column-start: 1;
    grid-column-end: 2;
}

.validator {
    background: gray;
    color: white;
    grid-column-start: 1;
    grid-column-end: 2;
    border: 2px dotted red;
}

.nodesetup {
    background: orange;
    color: white;
    grid-column-start: 1;
    grid-column-end: 2;
}

.service {
    background: magenta;
    color: white;
    grid-row-start: 1;
    grid-row-end: 5;
    grid-column-start: 2;
    grid-column-end: 3;
}

.sidebar {
    background: green;
    color: white;
    grid-row-start: 1;
    grid-row-end: 5;
    grid-column-start: 3;
    grid-column-end: 4;
}

.footer {
    background: purple;
    color: white;
    grid-column-start: 1;
    grid-column-end: 4;
    border-radius: 0 0 25px 25px;
}
</style>