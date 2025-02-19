<template>
  <div class="connection-container" :style="containerStyle">
    <svg ref="svgRef" class="connection-svg" :style="svgStyle" :width="bounds.width" :height="bounds.height">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        ref="pathRef"
        :d="calculatePathD"
        class="connection-path"
        fill="none"
        :stroke="color"
        :stroke-width="strokeWidth"
        stroke-dasharray="5,5"
        :filter="props.glow ? 'url(#glow)' : 'none'"
        :style="{ opacity: isPathReady ? 1 : 0 }"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { gsap } from "gsap";

const props = defineProps({
  start: {
    type: Object,
    required: true,
  },
  end: {
    type: Object,
    required: true,
  },
  color: {
    type: String,
    default: "#000",
  },
  strokeWidth: {
    type: Number,
    default: 2,
  },
  animated: {
    type: Boolean,
    default: true,
  },
  glow: {
    type: Boolean,
    default: false,
  },
});

const svgRef = ref(null);
const pathRef = ref(null);
const bounds = ref({ x: 0, y: 0, width: 0, height: 0 });

const getConnectionPoint = (element, position) => {
  const rect = element.getBoundingClientRect();

  if (position?.x && position?.y) {
    return { x: position.x, y: position.y };
  }

  if (element === props.start.element) {
    return {
      x: rect.right,
      y: rect.top + rect.height / 2,
    };
  }

  return {
    x: rect.left,
    y: rect.top + rect.height / 2,
  };
};

const containerStyle = computed(() => ({
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: "1000",
}));

const calculatePathD = computed(() => {
  if (!props.start.element || !props.end.element) return "";

  const startPoint = getConnectionPoint(props.start.element, props.start.position);
  const endPoint = getConnectionPoint(props.end.element, props.end.position);

  const startX = startPoint.x - bounds.value.x;
  const startY = startPoint.y - bounds.value.y;
  const endX = endPoint.x - bounds.value.x;
  const endY = endPoint.y - bounds.value.y;

  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 100) {
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  }

  // const midX = (startX + endX) / 2;
  // const midY = (startY + endY) / 2;

  const isHorizontal = Math.abs(dx) > Math.abs(dy);

  if (isHorizontal) {
    const controlPoint1X = startX + distance * 0.2;
    const controlPoint1Y = startY;
    const controlPoint2X = endX - distance * 0.2;
    const controlPoint2Y = endY;

    return `M ${startX} ${startY} 
            C ${controlPoint1X} ${controlPoint1Y} 
              ${controlPoint2X} ${controlPoint2Y} 
              ${endX} ${endY}`;
  } else {
    const controlPoint1X = startX;
    const controlPoint1Y = startY + distance * 0.2;
    const controlPoint2X = endX;
    const controlPoint2Y = endY - distance * 0.2;

    return `M ${startX} ${startY} 
            C ${controlPoint1X} ${controlPoint1Y} 
              ${controlPoint2X} ${controlPoint2Y} 
              ${endX} ${endY}`;
  }
});

const isPathReady = ref(false);

onMounted(() => {
  const observer = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const { x, y, width, height } = entry.contentRect;
      bounds.value = { x, y, width, height };
    }
  });
  if (props.start.element) observer.observe(props.start.element);
  if (props.end.element) observer.observe(props.end.element);
  animatePath();
});

const animatePath = () => {
  if (!props.animated || !pathRef.value) return;

  const pathLength = pathRef.value.getTotalLength();

  gsap.set(pathRef.value, {
    strokeDasharray: `${pathLength} ${pathLength}`,
    strokeDashoffset: pathLength,
    opacity: 0,
  });

  gsap.to(pathRef.value, {
    strokeDashoffset: 0,
    strokeDasharray: true,
    duration: 0.8,
    ease: "power2.out",
    onStart: () => {
      isPathReady.value = true;
    },
  });
};
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
  transition: d 0.3s ease;
}
</style>
