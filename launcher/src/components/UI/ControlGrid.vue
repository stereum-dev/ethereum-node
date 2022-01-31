<template>
  <div class="ctrGridParent">
    <div class="ctrplugin">PLUGIN</div>
    <div class="control">CONTROL</div>
    <div class="comments">COMMENTS</div>
    <div class="alerts">ALERTS</div>
    <div class="ctrlfooter">FOOTER</div>
  </div>
</template>

<style scoped>
.ctrGridParent {
  display: grid;
  height: 93%;
  top: 7.5%;
  grid-template-columns: 30% 55% 15%;
  grid-template-rows: repeat(3, 31.5%) 5%;
  position: relative;
}

.ctrplugin {
  background: red;
  color: white;
  grid-column-start: 1;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 4;
}

.control {
  background: blue;
  color: white;
  grid-column-start: 2;
  grid-column-end: 4;
  grid-row-start: 1;
  grid-row-end: 3;
}

.comments {
  background: yellow;
  color: black;
  grid-column-start: 2;
  grid-column-end: 3;
  grid-row-start: 3;
  grid-row-end: 4;
}

.alerts {
  background: green;
  color: white;
  grid-column-start: 3;
  grid-column-end: 4;
  grid-row-start: 2;
  grid-row-end: 4;
}

.ctrlfooter {
  background: purple;
  color: white;
  grid-column-start: 1;
  grid-column-end: 4;
  border-radius: 0 0 25px 25px;
}
</style>
