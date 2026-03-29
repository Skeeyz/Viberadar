<template>
  <div class="movie-card-skeleton" aria-hidden="true">
    <div class="poster-container">
      <SkeletonBlock class="poster-skeleton" height="100%" radius="0" />
      <SkeletonBlock class="favorite-skeleton" width="36px" height="36px" radius="999px" />
    </div>

    <div class="content">
      <SkeletonBlock width="72%" height="22px" radius="8px" />

      <div class="meta">
        <SkeletonBlock width="56px" height="20px" radius="6px" />
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
          v-for="genre in genreCount"
          :key="genre"
          :width="genre === genreCount ? '64px' : '52px'"
          height="24px"
          radius="999px"
        />
      </div>

      <SkeletonBlock
        v-if="showButton"
        class="button-skeleton"
        width="100%"
        height="44px"
        radius="8px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SkeletonBlock from "./SkeletonBlock.vue"

defineOptions({
  name: "MovieCardSkeleton"
})

withDefaults(defineProps<{
  descriptionLines?: number
  genreCount?: number
  showGenres?: boolean
  showButton?: boolean
}>(), {
  descriptionLines: 2,
  genreCount: 2,
  showGenres: true,
  showButton: true
})
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

.favorite-skeleton {
  position: absolute;
  top: 12px;
  right: 12px;
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

.button-skeleton {
  margin-top: 8px;
}
</style>
