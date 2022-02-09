<template>

    <div class="nodeparent">
        <div class="execution">
            <the-trapezium>
                <node-drag></node-drag>
            </the-trapezium>
        </div>
        <div class="consensus">
            <the-trapezium>
                <node-drag></node-drag>
            </the-trapezium>
        </div>
        <div class="validator">
            <the-trapezium>
                <node-drag></node-drag>
            </the-trapezium>
        </div>
        <div class="nodesetup">NODE SETUP</div>

    
        <div class="service">
            <div class="title">SERVICE PLUGIN</div>
            <div class="service-container">
                <base-button class="btn">
                    <div class="arrow-up"></div>
                </base-button>
                <service-plugin></service-plugin>
                <base-button class="btn">
                    <div class="arrow-down"></div>
                </base-button>
            </div>
        </div>
    
        <div class="sidebar">SIDEBAR</div>
        <div class="footer">FOOTER</div>
    </div>
</template>

<script>

import TheTrapezium from "../UI/TheTrapezium.vue";
import NodeDrag from '../UI/NodeDrag.vue';
import ServicePlugin from "../layers/ServicePlugin.vue";
export default {


    components: { TheTrapezium, NodeDrag, ServicePlugin },



};
</script>

<style scoped>
.nodeparent {
    display: grid;
    height: 93%;
    grid-template-columns: 70% 20% 10%;
    grid-template-rows: repeat(4, 23.75%) 5%;
    grid-row-gap: 1px;
    position: relative;
    top: 7%;
    margin: 0;
}

.execution {
    color: white;
    grid-column-start: 1;
    grid-column-end: 2;
    align-self: center;
}

.consensus {
    color: red;
    grid-column-start: 1;
    grid-column-end: 2;
    align-self: center;
}

.validator {
    color: white;
    grid-column-start: 1;
    grid-column-end: 2;
    align-self: center;
    box-sizing: border-box;
}

.nodesetup {
    background: orange;
    color: white;
    grid-column-start: 1;
    grid-column-end: 2;
}

.service {
    background: #336666;
    color: white;
    grid-row-start: 1;
    grid-row-end: 5;
    grid-column-start: 2;
    grid-column-end: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
}

.title {
    height: 5%;
    background: #000;
    margin: 1rem 0;
    font-weight: bold;
    padding: .5px;
    text-align: center;
    font-size: 90%;
}

.service-container {
    width: 90%;
    height: 85%;
    background: #4F4F4F;
    align-self: center;
    border-radius: 20px;
    overflow: hidden;
    padding: 5%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.btn {
    width: 90%;
    margin: 3%;
    height: 5%;
    display: flex;
    justify-content: center;
    align-self: center;
    overflow: hidden;
}

.arrow-up {
    width: 0;
    height: 50%;
    border-bottom: solid .5rem #eee;
    border-left: solid 50px transparent;
    border-right: solid 50px transparent;
    resize: both;
}
.arrow-down{
    width: 0;
  height: 50%;
  border-top: solid .5rem #eee;
  border-left: solid 50px transparent;
  border-right: solid 50px transparent;
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
