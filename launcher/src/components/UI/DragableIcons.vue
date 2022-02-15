<template>
    <div class="box">
        <div class="rhombus">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.box {
    background: #CCC;
    margin: 100px auto;
    border: 1px solid #000;
    width: 200px;
    height: 200px;
}

.rhombus {
    background: yellow;
    transform: rotate(45deg);
    border: 1px solid #000;
    width: 140px;
    height: 140px;
    margin: 15% auto;
}
</style>