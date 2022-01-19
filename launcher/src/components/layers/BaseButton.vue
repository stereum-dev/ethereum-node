<template>
    <div>
        <button class="button--login">LOGIN</button>
    </div>
</template>

<script>
export default {
    name:"BaseButton"
}
</script>

<style scoped>
.button--login{
        background-color: var(--button-color);
        color: var(--first-color);
        padding-top: var(--mb-0-5);
        padding-bottom: var(--mb-0-5);
        padding-left: var(--mb-1-5);
        padding-right: var(--mb-1-5);
        font-size: var(--h1-font-size);
        border-radius: var(--mb-2);
        border-style: solid;
        border-color: var(--border-color);
    }
    .button--login:hover{
        color: var(--hover-color);
        border-color: var(--hover-color);
    }
</style>