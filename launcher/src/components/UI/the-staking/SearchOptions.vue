<template>
  <div class="searchOptions">
    <img
      class="rename"
      src="../../../../public/img/icon/the-staking/rename-icon.png"
      alt="icon"
    />
    <img
      class="folder"
      src="../../../../public/img/icon/the-staking/newfolder-icon.png"
      alt="icon"
    />
    <img
      class="filter"
      src="../../../../public/img/icon/the-staking/staking-filter.png"
      alt="icon"
    />
  </div>
</template>
<style scoped>
.searchOptions {
  grid-column: 1/3;
  grid-row: 2/3;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.searchOptions .rename,
.searchOptions .folder,
.searchOptions .filter {
  margin-top: 50px;
  width: 23px;
}
</style>
