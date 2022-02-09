<template>
    <section id="main">
        <section id="contTra">
            <div id="trapezoid">
                <slot></slot>
    
            </div>
        </section>
    </section>
</template>

<script></script>

<style scoped>
#trapezoid {
    height: 0;
    width: auto;
    margin: 5px;
    border-bottom: 7rem solid #828282;
    border-left: 7rem solid transparent;
    border-right: 7rem solid transparent;
}

#contTra {
    border: 3px solid #828282;
    margin: auto;
    height: 100%;
    width: 98%;
    background: #336666;
}
</style>
