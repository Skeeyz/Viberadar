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
        title: 'Sign In required',
        text: 'You need to sign in to use this feature!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sign In',
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
            title: 'Remove from favorites?',
            text: `Are you sure you want to remove "${movie.title || movie.name}" from your favorites?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Remove',
            cancelButtonText: 'Keep',
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
            title: isRemoving ? 'Removed from your favorites!' : 'Added to your favorites!'
        });
    } catch (error) {
        favorites.value = oldFavorites;
        Swal.fire('Error', 'We couldn\'t complete this action. Please try again!', 'error');
    }
  }

  const isFavorite = (id: number) => {
    return favorites.value.some(m => m.id === id);
  }

  return {favorites, loading, fetchFavorites, toggleFavorite, isFavorite};
});

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
        title: 'Sign In required',
        text: 'You need to sign in to use this feature!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sign In',
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
            title: 'Remove from watchlist?',
            text: `Are you sure you want to remove "${movie.title || movie.name}" from your watchlist?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Remove',
            cancelButtonText: 'Keep',
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
            title: isRemoving ? 'Removed from your watchlist!' : 'Added to your watchlist!'
        });
    } catch (error) {
        watchlist.value = oldFavorites;
        Swal.fire('Lỗi', 'We couldn\'t complete this action. Please try again!', 'error');
    }
  }

  const isInWatchlist = (id: number) => watchlist.value.some(m => m.id === id)

  return { watchlist, loading, fetchWatchlist, toggleWatchlist, isInWatchlist }
});

export const useProfileStore = defineStore('profile', () => {
  const authStore = useAuthStore()
  const loading = ref(false)
  const updateProfileName = async (newName: string) =>{
    if (!authStore.isAuthenticated) {
      const result = await Swal.fire({
        title: 'Sign In required',
        text: 'You need to sign in to use this feature!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sign In',
        confirmButtonColor: '#22d3ee'
      });
      
      if (result.isConfirmed) {
        router.push('/auth/signin');
      }
      return;
    }
    const confirmResult = await Swal.fire({
            title: 'Update username?',
            text: `Are you sure you want to change your username to "${newName}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Change',
            cancelButtonText: 'Keep',
            reverseButtons: true 
        });
    if(confirmResult.isConfirmed){
      try{
        loading.value=true;
        const response = await userService.updateProfileName(newName);
        return { 
          success: true, 
          message: response.data?.message || 'Username updated successfully' 
        };
      }
      catch(error){
        return { 
          success: false, 
          message: error.response?.data?.message || 'Update failed. Please try again.' 
        };
      }
      finally{
        loading.value=false;
      }
    }
    else
      return;
  }

  const changePassword = async (currentPassword: string, confirmPassword: string) =>{
    if (!authStore.isAuthenticated) {
      const result = await Swal.fire({
        title: 'Sign In required',
        text: 'You need to sign in to use this feature!',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sign In',
        confirmButtonColor: '#22d3ee'
      });
      
      if (result.isConfirmed) {
        router.push('/auth/signin');
      }
      return;
    }
    const confirmResult = await Swal.fire({
            title: 'Change password?',
            text: `Are you sure you want to change your password?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Change',
            cancelButtonText: 'Keep',
            reverseButtons: true 
        });
    if(confirmResult.isConfirmed){
      try{
        loading.value=true;
        const response = await userService.changePassword({password: currentPassword, newPassword: confirmPassword});
        return { 
          success: true, 
          message: response.data?.message || 'Password updated successfully!' 
        };
      } catch (error) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to update password.',
          status: error.response?.status 
        };
        
      } finally {
        loading.value = false;
      }
    }
    else
      return;
  }
  return {loading, updateProfileName, changePassword};
});