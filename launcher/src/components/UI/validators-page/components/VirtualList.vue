<template>
  <div ref="scroller" class="relative w-full h-full overflow-y-auto" @scroll="onScroll">
    <div :style="{ height: `${items.length * itemHeight}px` }">
      <div :style="{ transform: `translateY(${start * itemHeight}px)` }">
        <div v-for="(item, i) in visible" :key="itemKey(item)" :style="{ height: `${itemHeight}px` }">
          <slot :item="item" :index="start + i" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Fixed row height list that only renders the rows in view (plus a buffer), so thousands of keys stay cheap
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  items: { type: Array, required: true },
  itemHeight: { type: Number, default: 32 },
  itemKey: { type: Function, required: true },
  buffer: { type: Number, default: 8 },
});

const scroller = ref(null);
const scrollTop = ref(0);
const viewHeight = ref(0);
let observer;

const start = computed(() => Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer));
const end = computed(() => Math.min(props.items.length, Math.ceil((scrollTop.value + viewHeight.value) / props.itemHeight) + props.buffer));
const visible = computed(() => props.items.slice(start.value, end.value));

const onScroll = () => (scrollTop.value = scroller.value.scrollTop);

// a shorter list (new filter) must not leave the view scrolled past its end
watch(
  () => props.items.length,
  () => {
    if (scroller.value && scrollTop.value > props.items.length * props.itemHeight) {
      scroller.value.scrollTop = 0;
      scrollTop.value = 0;
    }
  }
);

onMounted(() => {
  viewHeight.value = scroller.value.clientHeight;
  observer = new ResizeObserver(() => (viewHeight.value = scroller.value?.clientHeight ?? 0));
  observer.observe(scroller.value);
});
onBeforeUnmount(() => observer?.disconnect());

defineExpose({ scrollToTop: () => scroller.value && (scroller.value.scrollTop = 0) });
</script>
