<template>
  <div
    class="btn-parent mt-3 w-11/12 h-12 pr-4 font-semibold text-xl uppercase box-border justify-end flex items-center cursor-pointer"
  >
    test <img src="" alt="" />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.btn-parent {
  color: #eee;
  border: 1px solid #343434;
  box-shadow: 5px 1px 10px 1px rgb(36, 36, 36);
  border-radius: 10px;
  background: #a1c1ad;
  color: #000;
}
.btn-parent:active {
  box-shadow: 1px 1px 10px 1px #171717 inset;
}
</style>
