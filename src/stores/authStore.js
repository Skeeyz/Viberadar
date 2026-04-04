import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';
import { useFavoriteStore, useWatchlistStore } from '@/stores/userStore';
import Swal from 'sweetalert2';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    isInitialLoading: true,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    async checkAuth() {
      if (!this.token){
        this.isInitialLoading = false;
        return false;
      } 
      this.loading = true;

      try {
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
        const favoriteStore = useFavoriteStore();
        favoriteStore.fetchFavorites();
        const watchlistStore = useWatchlistStore();
        watchlistStore.fetchWatchlist();
        return true;
      } catch (err) {
        console.error("Token hết hạn hoặc không hợp lệ");
        this.logout();
        return false;
      } finally {
        this.loading = false;
        this.isInitialLoading = false;
      }
    },
    async signIn(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3000/api/auth/signin', {
          email,
          password
        });

        const { user, token } = response.data;
        await this.handleAuthSuccess(user, token);
        router.push('/');
        localStorage.setItem('auth_method', 'default');
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed';
      } finally {
        this.loading = false;
      }
    },

    async signUp(name, email, password) {
      this.loading = true;
      this.error = null;
      try {
        await axios.post('http://localhost:3000/api/auth/signup', {
          name, email, password
        });
        return true; 
      } catch (err) {
        this.error = err.response?.data?.message || 'Đăng ký thất bại';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async loginWithFacebook(accessToken) {
      this.loading = true;
      try {
        const response = await axios.post('http://localhost:3000/api/auth/facebook-login', {
          accessToken
        });

        const { user, token } = response.data;
        await this.handleAuthSuccess(user, token);
        localStorage.setItem('auth_method', 'facebook');
        return true;
      } catch (err) {
        this.error = "Xác thực Facebook thất bại!";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle(credential) {
      this.loading = true;
      try {
        const response = await axios.post('http://localhost:3000/api/auth/google-login', {
          credential
        });
        const { user, token } = response.data;
        await this.handleAuthSuccess(user, token);
        localStorage.setItem('auth_method', 'google');
        return true;
      } catch (err) {
        this.error = "Google Login thất bại!";
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('auth_method');
      router.push('/auth/signin');
    },

    async handleAuthSuccess(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
      const favoriteStore = useFavoriteStore();
      await favoriteStore.fetchFavorites(); 
      const watchlistStore = useWatchlistStore();
      await watchlistStore.fetchWatchlist();
      Toast.fire({
            icon: 'success',
            title: 'Đăng nhập thành công!'
        });
      router.push('/');
    },

  }
});