<template>
    <div class="drag-node">
        <div class="drag_input"></div>
        <div class="drag_input"></div>
        <div class="drag_input"></div>
        <div class="drag_input"></div>
        <div class="drag_input"></div>
    </div>
</template>

<style scoped>
.drag-node {
    padding: 5px;
    display: flex;
    box-sizing: border-box;
}

.drag_input {
    background: orange;
    color: white;
    padding: 10px;
    border: 5px solid black;
    margin: 5px;
    width: 20%;
    height: 3rem;
    border-radius: 10px;
    resize: both;
}
</style>
