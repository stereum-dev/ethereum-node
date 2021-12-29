<template>

  <img :src="flag">

      
   

    
  
</template>

<script>
export default {
  name:'LangButton',
  props:['flag']
}
</script>

<style scoped>
button{
background-image: inherit;
}
img{
  display:block;
  position: absolute;
  top: 10%;
  left: 10%;
  width: 55%;
  min-height: 10%;
  min-width: 10%;
  transform: translate(-50%, -50%);
  resize: both;

  
}
</style>