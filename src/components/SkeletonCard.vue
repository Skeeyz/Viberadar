<template>
  <div class="skeleton-card">

    <div class="skeleton skeleton-poster"></div>

    <div class="content">
      <div class="skeleton skeleton-title"></div>

      <div class="meta">
        <div class="skeleton skeleton-year"></div>
        <div class="skeleton skeleton-rating"></div>
      </div>

      <div class="skeleton skeleton-description"></div>
      <div class="skeleton skeleton-description short"></div>

      <div class="genres">
        <div class="skeleton skeleton-genre"></div>
        <div class="skeleton skeleton-genre"></div>
      </div>

      <div class="skeleton skeleton-button"></div>

    </div>
  </div>
</template>

<style scoped>

.skeleton-card{
  width:100%;
  max-width:280px;
  background:#1a1a2e;
  border-radius:12px;
  overflow:hidden;
}

.skeleton{
  background:linear-gradient(
    90deg,
    #2a2a3a 25%,
    #3a3a4a 50%,
    #2a2a3a 75%
  );
  background-size:200% 100%;
  animation:loading 1.4s infinite;
}

@keyframes loading{
  0%{ background-position:200% 0 }
  100%{ background-position:-200% 0 }
}

.skeleton-poster{
  width:100%;
  aspect-ratio:2/3;
}

.content{
  padding:16px;
}

.skeleton-title{
  height:18px;
  width:70%;
  margin-bottom:12px;
}

.meta{
  display:flex;
  gap:10px;
  margin-bottom:12px;
}

.skeleton-year{
  height:14px;
  width:40px;
}

.skeleton-rating{
  height:14px;
  width:60px;
}

.skeleton-description{
  height:12px;
  width:100%;
  margin-bottom:6px;
}

.skeleton-description.short{
  width:80%;
}

.genres{
  display:flex;
  gap:6px;
  margin-top:10px;
}

.skeleton-genre{
  height:16px;
  width:50px;
  border-radius:8px;
}

.skeleton-button{
  height:36px;
  width:100%;
  margin-top:14px;
  border-radius:8px;
}

</style>
