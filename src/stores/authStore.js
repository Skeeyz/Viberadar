import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

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
        // Gửi token qua Header Authorization
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: { Authorization: `Bearer ${this.token}` }
        });

        this.user = response.data.user;
        // Cập nhật lại thông tin user mới nhất vào máy
        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } catch (err) {
        console.error("Token hết hạn hoặc không hợp lệ");
        this.logout(); // Xóa sạch dữ liệu nếu token lỗi
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
        // Thay URL này bằng URL Backend của bạn sau này
        const response = await axios.post('http://localhost:3000/api/auth/signin', {
          email,
          password
        });

        const { user, token } = response.data;

        // Lưu vào state và localStorage
        this.user = user;
        this.token = token;
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        // Đăng nhập xong thì chuyển về trang chủ
        router.push('/');
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
        // Đăng ký xong có thể chuyển user sang trang Sign In
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
        
        // Lưu thông tin y hệt như đăng nhập thường
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
        
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
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('token', this.token);
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
      router.push('/auth/signin');
    }
  }
});