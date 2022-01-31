<template>
<div> 
      <img :src='link' >
</div>

</template>

<script>
export default {
name:'BaseLogo',
props:['link']
}
</script>

<style scoped>


/*img{
  display: block;

  top: 50%;
  left: 50%;
  width: 52%;
  min-height: 20%;
  min-width: 20%;
  transform: translate(-50%, -50%);
  resize: both;

  
}*/
img{
width: 50%;
min-width: 60%;




}
</style>