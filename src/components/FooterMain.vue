<template>
  <footer class="footer">
    <div class="footer-container">

      <!-- Logo + Description -->
      <div class="footer-section">
        <h2 class="logo">MovieApp</h2>
        <p class="desc">
          Watch your favorite movies and TV shows anytime, anywhere.
        </p>
      </div>

      <!-- Navigation -->
      <div class="footer-section">
        <h3>Browse</h3>
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#">Movies</a></li>
          <li><a href="#">TV Shows</a></li>
          <li><a href="#">Top Rated</a></li>
        </ul>
      </div>

      <!-- Support -->
      <div class="footer-section">
        <h3>Support</h3>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Account</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Use</a></li>
        </ul>
      </div>

      <!-- Social -->
      <div class="footer-section">
        <h3>Follow Us</h3>
        <div class="socials">
          <a href="#">Facebook</a>
          <a href="#">YouTube</a>
          <a href="#">Twitter</a>
        </div>
      </div>

    </div>

    <!-- Bottom -->
    <div class="footer-bottom">
      © 2026 MovieApp. All rights reserved.
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #0f0f0f;
  color: #ccc;
  margin-top: 40px;
}

.footer-container {
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.logo {
  color: #e50914;
  margin-bottom: 10px;
}

.desc {
  font-size: 14px;
  color: #aaa;
}

/* Section */
.footer-section h3 {
  margin-bottom: 10px;
  color: #fff;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section li {
  margin-bottom: 8px;
}

.footer-section a {
  text-decoration: none;
  color: #aaa;
  font-size: 14px;
  transition: 0.3s;
}

.footer-section a:hover {
  color: #fff;
}

/* Social */
.socials {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Bottom */
.footer-bottom {
  border-top: 1px solid #222;
  text-align: center;
  padding: 15px;
  font-size: 13px;
  color: #777;
}
</style>
