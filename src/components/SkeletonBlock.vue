<template>
  <component
    :is="tag"
    class="skeleton-block"
    :class="{ 'is-animated': animated }"
    :style="blockStyle"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from "vue"

defineOptions({
  name: "SkeletonBlock"
})

const props = withDefaults(defineProps<{
  tag?: string
  width?: string
  height?: string
  radius?: string
  animated?: boolean
}>(), {
  tag: "div",
  width: "100%",
  height: "1rem",
  radius: "10px",
  animated: true
})

const blockStyle = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.radius
}))
</script>

<style scoped>
.skeleton-block {
  display: block;
  background: linear-gradient(
    90deg,
    rgba(71, 85, 105, 0.28) 25%,
    rgba(148, 163, 184, 0.4) 50%,
    rgba(71, 85, 105, 0.28) 75%
  );
  background-size: 200% 100%;
}

.is-animated {
  animation: skeleton-loading 1.4s ease-in-out infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .is-animated {
    animation: none;
  }
}
</style>
