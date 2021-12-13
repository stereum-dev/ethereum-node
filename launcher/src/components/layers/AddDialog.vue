<template>
    <dialog open>
        
 <div class="formGroup">
                <label for="serverName">ServerName</label>
                <input name="serverName" id="serverName" type="text" ref="serverName" />
              </div>
              <div class="formGroup">
                <label for="localPort">LocalPort</label>
                <input name="localPort" id="localPort" type="text" ref="localPort" />
              </div>
              <div class="formGroup">
                <label for="DstPort">DstPort</label>
                <input name="DstPort" id="DstPort"  ref="dstPort"/>
              </div> 
              <div class="formGroup" v-if="logError">
                <p>Please complete all filed!</p>
              </div>
              <div>
                <button @click="addServer">Add Server</button>

                  <button @click="$emit('dialogDis',true)">Cancel</button>
                  </div> 
                </dialog>
</template>
<script>
export default {
    name:'addDialog'
    ,
    emits:['pass','dialogDis'],
    data(){return{
      logError:false
    }},
    methods: {
        addServer(){

            const serverName=this.$refs['serverName'].value
            const localPort=this.$refs['localPort'].value        

            const dstPort=this.$refs['dstPort'].value
if(serverName!='' && localPort!='' && dstPort!=''  ){
            const obj={name:serverName,localPort:localPort,dstPort:dstPort}
            
            this.$emit('pass',obj)
            
            }else{
              this.logError=true;
            }
        }
    },
}

</script>
<style scoped>
dialog{
  border:2px solid grey;
}
</style>