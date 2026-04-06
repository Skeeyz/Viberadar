<template>
  <div class="tab-content">
    <section class="section">
      <h2 class="section-title">User Reviews</h2>

      <!-- Loading -->
      <div v-if="loading" class="state-msg">Loading reviews...</div>

      <!-- Error -->
      <div v-else-if="error" class="state-msg error">{{ error }}</div>

      <!-- Reviews list -->
      <template v-else>
        <div v-if="reviews.length === 0" class="state-msg">
          No reviews yet.
        </div>

        <div v-for="review in visibleReviews" :key="review.id" class="review-card">
          <!-- Author row -->
          <div class="review-header">
            <div class="author-avatar">
              <img v-if="review.avatar" :src="review.avatar" :alt="review.author" />
              <div v-else class="avatar-fallback">{{ review.author.charAt(0).toUpperCase() }}</div>
            </div>
            <div class="author-info">
              <div class="author-name">A review by {{ review.author }}</div>
              <div class="author-meta">
                <span v-if="review.rating" class="rating-badge">
                  <span class="star-icon">★</span> {{ review.rating }}%
                </span>
                <span class="written-by">
                  Written by {{ review.author }} on {{ review.date }}
                </span>
              </div>
            </div>
          </div>

          <!-- Review body -->
          <div class="review-body">
            <p class="review-text">
              {{ expandedIds.includes(review.id) ? review.content : (review.content.length > EXCERPT_LENGTH ? review.content.slice(0, EXCERPT_LENGTH) + '...' : review.content) }}
              <button v-if="review.content.length > EXCERPT_LENGTH" class="btn-read-more" @click="toggleExpand(review.id)">
                {{ expandedIds.includes(review.id) ? 'Show less.' : `Read more` }}
              </button>
            </p>
          </div>
        </div>

        <!-- Load more -->
        <button
          v-if="reviews.length > visibleCount"
          class="btn-load-more"
          @click="visibleCount += PAGE_SIZE"
        >
          Load More Reviews
        </button>
      </template>
    </section>
  </div>
</template>

<script>
import { fetchMovieReviews } from '@/services/movieService.js'

const EXCERPT_LENGTH = 400
const PAGE_SIZE = 5

export default {
  name: 'MovieTabReviews',

  props: {
    movie: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      reviews: [],
      loading: true,
      error: null,
      expandedIds: [],
      visibleCount: PAGE_SIZE,
      EXCERPT_LENGTH,
      PAGE_SIZE,
    }
  },

  computed: {
    visibleReviews() {
      return this.reviews.slice(0, this.visibleCount)
    },
  },

  async created() {
  try {
    const { reviews } = await fetchMovieReviews(this.movie.id)   // 
    this.reviews = reviews
  } catch (err) {
    this.error = 'Không thể tải reviews. Vui lòng thử lại.'
    console.error(err)
  } finally {
    this.loading = false
  }
},

  methods: {
    toggleExpand(id) {
      if (this.expandedIds.includes(id)) {
        this.expandedIds = this.expandedIds.filter(i => i !== id)
      } else {
        this.expandedIds.push(id)
      }
    },
  },
}
</script>

<style scoped>
.tab-content { padding-top: 4px; }

.section { margin-bottom: 36px; }
.section-title {
  font-family: 'Barlow', sans-serif;
  font-size: 1.15rem; font-weight: 700; color: #e8f0f8; margin-bottom: 20px;
}

/* State messages */
.state-msg { color: #8899aa; font-size: 0.9rem; padding: 16px 0; }
.state-msg.error { color: #e8193c; }

/* Review card */
.review-card {
  background: #162230;
  border: 1px solid #1e2d3d;
  padding: 20px 24px;
  margin-bottom: 16px;
  transition: border-color 0.15s;
}
.review-card:hover { border-color: #2e4a62; }

/* Header */
.review-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  margin-bottom: 16px;
}

.author-avatar {
  flex-shrink: 0;
  width: 48px; height: 48px; border-radius: 50%;
  overflow: hidden;
  border: 2px solid #2a3a4a;
  background: #1e2d3d;
  display: flex; align-items: center; justify-content: center;
}
.author-avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-fallback {
  font-size: 1.2rem; font-weight: 700; color: #5b9bd5;
}

.author-info { flex: 1; }
.author-name {
  font-size: 0.95rem; font-weight: 700; color: #e8f0f8;
  margin-bottom: 5px;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.author-meta {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}

.rating-badge {
  display: inline-flex; align-items: center; gap: 4px;
  background: #1e2d3d; border: 1px solid #2a3a4a;
  color: #c8daea; font-size: 0.78rem; font-weight: 700;
  padding: 2px 9px;
}
.star-icon { color: #f5a623; font-size: 0.8rem; }

.written-by { color: #5a7a9a; font-size: 0.8rem; }

/* Review body */
.review-text {
  color: #8899aa;
  font-size: 0.88rem;
  line-height: 1.75;
  max-width: 800px;
}

.btn-read-more {
  background: none; border: none; padding: 0;
  color: #5b9bd5; font-size: 0.88rem; font-weight: 600;
  cursor: pointer; margin-left: 4px;
  text-decoration: underline; text-underline-offset: 2px;
  transition: color 0.15s;
}
.btn-read-more:hover { color: #7ab8f0; }

/* Load more */
.btn-load-more {
  background: transparent; border: 1px solid #2a3a4a; color: #8899aa;
  font-family: 'Barlow', sans-serif; font-size: 0.82rem; font-weight: 600;
  padding: 9px 20px; cursor: pointer; margin-top: 8px;
  transition: border-color 0.15s, color 0.15s; letter-spacing: 0.3px;
}
.btn-load-more:hover { border-color: #5a7a9a; color: #c8daea; }
</style>