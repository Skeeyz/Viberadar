# MOVIES

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


```
movies/
│
├── public/                 # File tĩnh (favicon, images, manifest...)
│
├── src/                    # Source code chính của ứng dụng
│
│   ├── assets/             # Hình ảnh, CSS, fonts
│   │
│   ├── components/         # Component tái sử dụng
│   │   ├── Header.vue
│   │   ├── Footer.vue
│   │   └── MovieCard.vue
│   │
│   ├── views/              # Các trang chính của ứng dụng
│   │   ├── Home.vue
│   │   ├── MovieList.vue
│   │   └── MovieDetail.vue
│   │
│   ├── router/             # Cấu hình định tuyến
│   │   └── index.js
│   │
│   ├── stores/             # Quản lý state toàn hệ thống (Pinia)
│   │   └── movieStore.js
│   │
│   ├── services/           # Gọi API từ backend hoặc external API
│   │   └── movieService.js
│   │
│   ├── layouts/            # Layout chung của website
│   │   └── MainLayout.vue
│   │
│   ├── utils/              # Helper functions
│   │
│   ├── App.vue             # Root component
│   │
│   └── main.js             # Entry point khởi chạy ứng dụng
│
├── .gitignore              # File bỏ qua khi push Git
│
├── package.json            # Danh sách dependency của project
│
├── vite.config.js          # Cấu hình build của Vite
│
└── README.md               # Tài liệu mô tả project
```
```
Mô tả các thành phần chính
components/

Chứa các UI component tái sử dụng nhiều lần.

Ví dụ:

MovieCard

Navbar

Footer

views/

Chứa các trang chính của ứng dụng (page-level component).

Ví dụ:

Trang chủ

Trang danh sách phim

Trang chi tiết phim

router/

Cấu hình điều hướng trang bằng Vue Router.

Ví dụ:

/ -> Home
/movies -> MovieList
/movie/:id -> MovieDetail
stores/

Quản lý state toàn cục của ứng dụng bằng Pinia.

Ví dụ:

danh sách phim

phim đang chọn

trạng thái loading

services/

Chứa logic gọi API.

Ví dụ:

getMovies()
getMovieDetail()
searchMovies()
layouts/

Chứa layout chung của website.

Ví dụ:

Header
Main Content
Footer
Công nghệ sử dụng trong project

Vue.js (Frontend Framework)

Vite (Build Tool)

Vue Router (Routing)

Pinia (State Management)
