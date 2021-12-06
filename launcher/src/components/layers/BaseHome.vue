<template>
<div>
<component :is="pageName" @page="page"></component>
    </div>
</template>
<script>
import TheFirst from './TheFirst.vue'
import SetupServer from './SetupServer.vue'
export default {
    data(){return{
        pageName:'TheFirst'
    }},
  components: { TheFirst ,SetupServer},
    name:'BaseHome',
    methods: {
        page(pageId){
            this.pageName=pageId
            alert(this.pageName)

        },
    },
 
}
</script>
<style>

</style>