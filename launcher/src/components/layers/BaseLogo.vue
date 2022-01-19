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

img{
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 52%;
  min-height: 20%;
  min-width: 20%;
  transform: translate(-50%, -50%);
  resize: both;
}
</style>