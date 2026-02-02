<template>
  <div class="fcl" :class="{ narrow }">
    <!-- begin -->
    <div v-if="showBegin" class="fcl-column begin" :style="beginStyle">
      <slot name="begin" />
    </div>

    <!-- resizer between begin & mid -->
    <div v-if="showBegin && showMid" class="resizer" @mousedown="startDrag('begin')">
      <div class="resizer-handle"></div>
    </div>

    <!-- mid -->
    <div v-if="showMid" class="fcl-column mid" :style="midStyle">
      <slot name="mid" />
    </div>

    <!-- resizer between mid & end -->
    <div v-if="showMid && showEnd" class="resizer" @mousedown="startDrag('mid')">
      <div class="resizer-handle"></div>
    </div>

    <!-- end -->
    <div v-if="showEnd" class="fcl-column end" :style="endStyle">
      <slot name="end" />
    </div>

    <!-- global overlay when dragging to capture pointer -->
    <div v-if="dragging" class="drag-overlay"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';
import { usePersistedState } from '../composables/usePersistedState';

const props = defineProps({ layout: { type: String, required: true } });

// Responsive: narrow if < 900px
const width = ref(window.innerWidth);
const onResize = () => (width.value = window.innerWidth);

onMounted(() => window.addEventListener('resize', onResize));
onBeforeUnmount(() => window.removeEventListener('resize', onResize));

const narrow = computed(() => width.value < 900);

// Visibility logic
const showBegin = computed(() => narrow.value ? props.layout === 'OneColumn' : ['OneColumn','TwoColumnsMidExpanded','ThreeColumnsMidExpanded'].includes(props.layout));
const showMid   = computed(() => narrow.value ? props.layout === 'TwoColumnsMidExpanded' : ['TwoColumnsMidExpanded','ThreeColumnsMidExpanded'].includes(props.layout));
const showEnd   = computed(() => props.layout === 'ThreeColumnsMidExpanded');

// --- Resizable widths (persisted) ---
const DEFAULTS = { begin: 280, end: 480, minBegin: 200, minEnd: 320, minMid: 400 }; // px
const sizes = usePersistedState('fcl-sizes', { begin: DEFAULTS.begin, end: DEFAULTS.end });

const containerRef = ref(null);
const dragging = ref(false);
const dragTarget = ref(null); // 'begin' or 'mid' (meaning the resizer before mid or end)
const startX = ref(0);
const startSizes = ref({ begin: 0, end: 0 });

function startDrag(which) {
  if (narrow.value) return; // disable on narrow
  dragging.value = true;
  dragTarget.value = which; // 'begin' or 'mid'
  startX.value = window.event.clientX;
  startSizes.value = { begin: sizes.value.begin, end: sizes.value.end };
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
}

function onDrag(e) {
  if (!dragging.value) return;
  const dx = e.clientX - startX.value;
  const containerWidth = containerRef.value?.clientWidth || window.innerWidth;

  if (dragTarget.value === 'begin') {
    // Move resizer between begin & mid
    let newBegin = Math.max(DEFAULTS.minBegin, startSizes.value.begin + dx);
    // Ensure mid has minimum width when end is present
    const endWidth = showEnd.value ? sizes.value.end : 0;
    const midAvailable = containerWidth - newBegin - endWidth - resizerBudget();
    if (midAvailable < DEFAULTS.minMid) {
      newBegin = containerWidth - endWidth - DEFAULTS.minMid - resizerBudget();
    }
    sizes.value.begin = clamp(newBegin, DEFAULTS.minBegin, containerWidth - endWidth - DEFAULTS.minMid - resizerBudget());
  } else if (dragTarget.value === 'mid') {
    // Move resizer between mid & end
    let newEnd = Math.max(DEFAULTS.minEnd, startSizes.value.end - dx);
    const midAvailable = containerWidth - sizes.value.begin - newEnd - resizerBudget();
    if (midAvailable < DEFAULTS.minMid) {
      newEnd = containerWidth - sizes.value.begin - DEFAULTS.minMid - resizerBudget();
    }
    sizes.value.end = clamp(newEnd, DEFAULTS.minEnd, containerWidth - sizes.value.begin - DEFAULTS.minMid - resizerBudget());
  }
}

function stopDrag() {
  dragging.value = false;
  dragTarget.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function resizerBudget() { return (showBegin.value && showMid.value ? 6 : 0) + (showMid.value && showEnd.value ? 6 : 0); }

// Column inline styles
const beginStyle = computed(() => ({ width: showBegin.value && !narrow.value ? sizes.value.begin + 'px' : undefined }));
const endStyle   = computed(() => ({ width: showEnd.value   && !narrow.value ? sizes.value.end + 'px'   : undefined }));
const midStyle   = computed(() => ({ flex: '1 1 auto' }));
</script>

<style scoped>
.fcl {
  display: flex;
  width: 100%;
  height: 100%;
  background: var(--bg-alt);
  position: relative;
  gap: 1px;
}

.fcl-column {
  overflow: auto;
  background: var(--bg);
  min-width: 0;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  box-shadow: var(--shadow-sm);
}

/* Default widths if no inline style (for SSR/first paint) */
.begin {
  width: 280px;
  min-width: 200px;
}

.mid {
  flex: 1;
  min-width: 400px;
}

.end {
  width: 480px;
  min-width: 320px;
}

/* Resizer */
.resizer {
  width: 8px;
  cursor: col-resize;
  background: transparent;
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 -3px;
}

.resizer-handle {
  width: 4px;
  height: 48px;
  background: var(--border);
  border-radius: 4px;
  transition: all var(--transition-fast);
}

.resizer:hover .resizer-handle {
  background: var(--primary);
  height: 64px;
  box-shadow: 0 0 8px rgba(8, 145, 178, 0.3);
}

.resizer:active .resizer-handle {
  background: var(--primary-dark);
  height: 80px;
}

.drag-overlay {
  position: fixed;
  inset: 0;
  cursor: col-resize;
  z-index: 2;
  background: transparent;
}

/* Narrow mode */
.fcl.narrow {
  gap: 0;
}

.fcl.narrow .begin,
.fcl.narrow .mid,
.fcl.narrow .end {
  width: 100% !important;
  min-width: 0;
  flex: 1 1 100%;
  border-radius: 0;
}

.fcl.narrow .resizer {
  display: none;
}
</style>
