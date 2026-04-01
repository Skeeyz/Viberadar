import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'
import Swal from 'sweetalert2'
import router from '@/router'

export const useFavoriteStore = defineStore('favorite', () => {
  const authStore = useAuthStore()
  const favorites = ref<any[]>([])
  const loading = ref(false)

  const fetchFavorites = async () => {
    if (!authStore.isAuthenticated) return;
    try {
      loading.value = true;
      const res = await userService.getFavorites();
      favorites.value = res.movies;
    } finally {
      loading.value = false;
    }
  }

  const toggleFavorite = async (movie: any) => {
    if (!authStore.isAuthenticated) {
      const result = await Swal.fire({
        title: 'Yêu cầu đăng nhập',
        text: 'Bạn cần đăng nhập để sử dụng tính năng này!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        confirmButtonColor: '#22d3ee'
      });
      
      if (result.isConfirmed) {
        router.push('/auth/signin');
      }
      return;
    }
    const exists = favorites.value.find(m => m.id === movie.id)
    const index = favorites.value.findIndex(m => m.id === movie.id);
    const oldFavorites = [...favorites.value];
    const isRemoving = index > -1;
    if (isRemoving){
        const confirmResult = await Swal.fire({
            title: 'Xóa khỏi danh sách?',
            text: `Bạn có chắc muốn bỏ "${movie.title || movie.name}" khỏi mục yêu thích?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Xóa bỏ',
            cancelButtonText: 'Giữ lại',
            reverseButtons: true 
        });
        if(confirmResult.isConfirmed)
            favorites.value.splice(index, 1);
        else
            return;
    } 
    else favorites.value.push(movie);

    try {
        await userService.toggleFavorite({ tmdbId: movie.id, mediaType: movie.media_type });
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: isRemoving ? 'Đã xóa khỏi danh sách' : 'Đã thêm vào yêu thích'
        });
    } catch (error) {
        favorites.value = oldFavorites;
        Swal.fire('Lỗi', 'Không thể cập nhật danh sách', 'error');
    }
  }

  const isFavorite = (id: number) => {
    return favorites.value.some(m => m.id === id);
  }

  return {favorites, loading, fetchFavorites, toggleFavorite, isFavorite};
})

export const useWatchlistStore = defineStore('watchlist', () => {
  const authStore = useAuthStore()
  const watchlist = ref<any[]>([])
  const loading = ref(false)

  const fetchWatchlist = async () => {
    if (!authStore.isAuthenticated) return;
    try {
      loading.value = true;
      const res = await userService.getWatchlist();;
      watchlist.value = res.movies || [];
    } finally {
      loading.value = false;
    }
  }

  const toggleWatchlist = async (movie: any) => {
    if (!authStore.isAuthenticated) {
      const result = await Swal.fire({
        title: 'Yêu cầu đăng nhập',
        text: 'Bạn cần đăng nhập để sử dụng tính năng này!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Đăng nhập',
        confirmButtonColor: '#22d3ee'
      });
      
      if (result.isConfirmed) {
        router.push('/auth/signin');
      }
      return;
    }
    const exists = watchlist.value.find(m => m.id === movie.id)
    const index = watchlist.value.findIndex(m => m.id === movie.id);
    const oldFavorites = [...watchlist.value];
    const isRemoving = index > -1;
    if (isRemoving){
        const confirmResult = await Swal.fire({
            title: 'Xóa khỏi danh sách?',
            text: `Bạn có chắc muốn bỏ "${movie.title || movie.name}" khỏi mục danh sách theo dõi?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Xóa bỏ',
            cancelButtonText: 'Giữ lại',
            reverseButtons: true 
        });
        if(confirmResult.isConfirmed)
            watchlist.value.splice(index, 1);
        else
            return;
    } 
    else watchlist.value.push(movie);

    try {
        await userService.toggleWatchlist({ tmdbId: movie.id, mediaType: movie.media_type });
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: isRemoving ? 'Đã xóa khỏi danh sách theo dõi' : 'Đã thêm vào danh sách theo dõi'
        });
    } catch (error) {
        watchlist.value = oldFavorites;
        Swal.fire('Lỗi', 'Không thể cập nhật danh sách', 'error');
    }
  }

  const isInWatchlist = (id: number) => watchlist.value.some(m => m.id === id)

  return { watchlist, loading, fetchWatchlist, toggleWatchlist, isInWatchlist }
})