<template>
  <div class="connection-container">
    <svg
      ref="svgRef"
      class="connection-svg"
      :style="svgStyle"
      :width="bounds.width"
      :height="bounds.height"
    >
      <path
        ref="pathRef"
        :d="pathData"
        class="connection-path"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed, onUnmounted } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  // Elements to connect
  start: {
    type: Object,
    required: true,
    validator: (prop) => prop.element && (prop.position || (prop.x && prop.y)),
  },
  end: {
    type: Object,
    required: true,
    validator: (prop) => prop.element && (prop.position || (prop.x && prop.y)),
  },
  color: {
    type: String,
    default: "#FFD700",
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
  animated: {
    type: Boolean,
    default: true,
  },
  dashed: {
    type: Boolean,
    default: true,
  },
});

const svgRef = ref(null);
const pathRef = ref(null);
const bounds = ref({ x: 0, y: 0, width: 0, height: 0 });
const pathData = ref("");

const svgStyle = computed(() => ({
  position: "absolute",
  left: `${bounds.value.x}px`,
  top: `${bounds.value.y}px`,
  pointerEvents: "none",
  zIndex: 1000,
}));

// Get connection point coordinates based on position
const getConnectionPoint = (element, position) => {
  const rect = element.getBoundingClientRect();

  switch (position) {
    case "right":
      return {
        x: rect.right,
        y: rect.top + rect.height / 2,
      };
    case "left":
      return {
        x: rect.left,
        y: rect.top + rect.height / 2,
      };
    case "top":
      return {
        x: rect.left + rect.width / 2,
        y: rect.top,
      };
    case "bottom":
      return {
        x: rect.left + rect.width / 2,
        y: rect.bottom,
      };
    default:
      // If specific coordinates are provided
      if (
        typeof position === "object" &&
        position.x !== undefined &&
        position.y !== undefined
      ) {
        return {
          x: rect.left + position.x,
          y: rect.top + position.y,
        };
      }
      // Default to center
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
  }
};

const calculateBounds = () => {
  if (!props.start.element || !props.end.element) return;

  const startPoint = getConnectionPoint(
    props.start.element,
    props.start.position || { x: props.start.x, y: props.start.y }
  );
  const endPoint = getConnectionPoint(
    props.end.element,
    props.end.position || { x: props.end.x, y: props.end.y }
  );

  const padding = 10;
  bounds.value = {
    x: Math.min(startPoint.x, endPoint.x) - padding,
    y: Math.min(startPoint.y, endPoint.y) - padding,
    width: Math.abs(endPoint.x - startPoint.x) + padding * 2,
    height: Math.abs(endPoint.y - startPoint.y) + padding * 2,
  };
};

const calculatePath = () => {
  if (!props.start.element || !props.end.element) return "";

  const startPoint = getConnectionPoint(
    props.start.element,
    props.start.position || { x: props.start.x, y: props.start.y }
  );
  const endPoint = getConnectionPoint(
    props.end.element,
    props.end.position || { x: props.end.x, y: props.end.y }
  );

  const startX = startPoint.x - bounds.value.x;
  const startY = startPoint.y - bounds.value.y;
  const endX = endPoint.x - bounds.value.x;
  const endY = endPoint.y - bounds.value.y;

  pathData.value = `M ${startX} ${startY} L ${endX} ${endY}`;
};

const animatePath = () => {
  if (!props.animated || !pathRef.value) return;
  const tl = gsap.timeline();
  tl.fromTo(
    pathRef.value,
    {
      strokeWidth: 1,
      strokeDashoffset: 90,
      strokeDasharray: "3",
      strokeMiterlimit: "1",
      opacity: 0,
    },
    {
      strokeWidth: 3,
      strokeDashoffset: 50,
      strokeMiterlimit: 10,
      opacity: 1,
      duration: 0.8,
      ease: "power2.out",
    }
  );
};

const updateConnection = () => {
  calculateBounds();
  calculatePath();
  if (props.animated) {
    animatePath();
  }
};

watch(
  () => [props.start, props.end],
  () => {
    updateConnection();
  },
  { deep: true }
);

onMounted(() => {
  updateConnection();

  window.addEventListener("resize", updateConnection);

  window.addEventListener("scroll", updateConnection);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateConnection);
  window.removeEventListener("scroll", updateConnection);
});
</script>

<style scoped>
.connection-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.connection-svg {
  overflow: visible;
}

.connection-path {
  pointer-events: none;
}
</style>
