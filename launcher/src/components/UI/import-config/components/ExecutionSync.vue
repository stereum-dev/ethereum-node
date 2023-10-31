<template>
  <div class="h-full col-start-1 col-span-full grid grid-cols-12 space-x-2">
    <div class="col-start-1 col-end-4 grid grid-cols-3 gap-1 bg-[#33393e] rounded-md py-1 px-2">
      <img class="w-9 h-9 col-start-1 col-span-1 self-center" :src="client.icon" alt="icon" />

      <div class="col-start-2 col-span-full self-center flex flex-col justify-start items-start">
        <span class="text-sm text-gray-300 font-semibold">{{ client.name }}</span>
        <span class="text-xs text-teal-500 font-semibold">{{ client.category }}</span>
      </div>
    </div>

    <div class="col-start-4 col-span-full bg-[#33393e] rounded-md py-1 px-2 flex justify-start items-center">
      <div class="w-1/2 flex flex-col justify-center items-start">
        <span class="text-md text-gray-300 font-semibold">{{ $t("executionSync.gen") }}</span>
        <span class="text-xs text-teal-500 font-normal">{{ $t("executionSync.syncClient") }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    client: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
};
</script>

<style scoped>
.executionSync_parent {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plugin-name {
  width: 25%;
  height: 88%;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.plugin-name .serviceIcon {
  width: 40%;
  height: 100%;
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.plugin-name .serviceIcon img {
  width: 80%;
}

.plugin-name .serviceBox {
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
}
.plugin-name .serviceBox span:first-child {
  width: 100%;
  color: #d5d5d5;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}
.plugin-name .serviceBox span:last-child {
  width: 100%;
  color: #4d8384;
  font-size: 0.7rem;
  font-weight: 500;
  text-align: center;
}

.syncBox {
  width: 66.5%;
  height: 88%;
  border: 1px solid #394047;
  border-radius: 5px;
  background-color: #33393e;
  box-shadow: 1px 1px 5px 1px rgb(33, 37, 41);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
>
