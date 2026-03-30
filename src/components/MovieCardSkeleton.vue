<template>
  <div class="movie-card-skeleton" aria-hidden="true">
    <div class="poster-container">
      <SkeletonBlock class="poster-skeleton" height="100%" radius="0" />
      <div class="overlay">
        <SkeletonBlock width="64px" height="64px" radius="999px" />
      </div>
    </div>

    <div class="content">
      <SkeletonBlock width="72%" height="22px" radius="8px" />

      <div class="meta">
        <SkeletonBlock width="52px" height="20px" radius="6px" />
        <div class="rating">
          <SkeletonBlock
            v-for="star in 5"
            :key="star"
            width="16px"
            height="16px"
            radius="999px"
          />
        </div>
      </div>

      <div class="description">
        <SkeletonBlock
          v-for="line in descriptionLines"
          :key="line"
          :width="line === descriptionLines ? '78%' : '100%'"
          height="12px"
          radius="6px"
        />
      </div>

      <div v-if="showGenres" class="genres">
        <SkeletonBlock
          v-for="genre in genreWidths"
          :key="genre"
          :width="genre"
          height="24px"
          radius="999px"
        />
      </div>

      <div class="actions-buttons">
        <SkeletonBlock class="button-skeleton" width="100%" height="40px" radius="8px" />
        <div class="reaction-group">
          <SkeletonBlock width="40px" height="40px" radius="8px" />
          <SkeletonBlock width="40px" height="40px" radius="8px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue"
import SkeletonBlock from "./SkeletonBlock.vue"

defineOptions({
  name: "MovieCardSkeleton"
})

const props = withDefaults(defineProps<{
  descriptionLines?: number
  genreCount?: number
  showGenres?: boolean
}>(), {
  descriptionLines: 2,
  genreCount: 3,
  showGenres: true
})

const defaultGenreWidths = ["56px", "56px", "44px", "64px", "52px"]

const genreWidths = computed(() => defaultGenreWidths.slice(0, props.genreCount))
</script>

<style scoped>
.movie-card-skeleton {
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.poster-container {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #0f0f0f;
}

.poster-skeleton {
  width: 100%;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating {
  display: inline-flex;
  gap: 4px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.genres {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.actions-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 10px;
}

.button-skeleton {
  flex: 1;
}

.reaction-group {
  display: flex;
  gap: 8px;
}
</style>
