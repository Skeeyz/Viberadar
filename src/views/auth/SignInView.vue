<template>
  <div class="flex flex-col items-center">
    <form @submit.prevent="handleSignIn" class="w-full space-y-4">
      
      <Transition name="fade">
        <div v-if="errorMessage || authStore.error" 
             class="bg-red-500/10 border border-red-500/50 text-red-500 text-sm py-2 px-4 rounded-lg text-center animate-pulse">
          {{ errorMessage || authStore.error }}
        </div>
      </Transition>

      <div class="relative">
        <input v-model="email" type="email" placeholder="Email"
          class="w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
      </div>

      <div class="relative">
        <input v-model="password" type="password" placeholder="Password"
          class="w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
      </div>

      <div class="flex items-center justify-between text-sm text-gray-400">
        <div class="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="remember" 
            v-model="rememberMe" 
            class="accent-cyan-500 w-4 h-4 cursor-pointer" 
          />
          <label for="remember" class="cursor-pointer">Remember me</label>
        </div>
        <router-link to="/auth/forgot-password" class="text-gray-400 hover:text-orange-500 hover:underline transition-colors">
          Forgot password?
        </router-link>
      </div>

      <button type="submit" :disabled="authStore.loading"
        class="w-full py-3 bg-transparent border border-cyan-500 text-white rounded-lg font-bold tracking-widest hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
        <span v-if="authStore.loading" class="flex items-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PROCESSING...
        </span>
        <span v-else>SIGN IN</span>
      </button>

      <SocialButtons @social-click="handleSocialLogin" />

      <div class="text-center mt-6 text-sm text-gray-400">
        Don't have an account? 
        <router-link to="/auth/signup" class="text-orange-500 font-medium hover:underline ml-1">
          Create an account!
        </router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import SocialButtons from '@/components/auth/SocialButtons.vue';

const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const rememberMe = ref(false);

onMounted(() => {
  // Kiểm tra xem trong máy có lưu email cũ không
  const savedEmail = localStorage.getItem('remembered_email');
  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.value = true;
  }
});

const validateForm = () => {
  errorMessage.value = ''; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email.value)) {
    errorMessage.value = "Email không đúng định dạng";
    return false;
  }
  if (password.value.length < 6) {
    errorMessage.value = "Mật khẩu phải từ 6 ký tự trở lên";
    return false;
  }
  return true;
};

const handleSignIn = async () => {
  console.log("==> Trạng thái checkbox:", rememberMe.value);
  if (!validateForm()) return;

  const success = await authStore.signIn(email.value, password.value);
  
  if (success) {
    // 2. Nếu đăng nhập thành công và có tích "Remember me"
    if (rememberMe.value) {
      localStorage.setItem('remembered_email', email.value);
      console.log("==> Trạng thái checkbox:", rememberMe.value);
    } else {
      // Nếu không tích thì xóa email đã lưu đi (nếu có)
      localStorage.removeItem('remembered_email');
    }
    
    router.push('/'); 
  }
};


const handleSocialLogin = (platform) => {
  if (authStore.loading) return; // Chặn nhấn chồng chéo
  errorMessage.value = ''; 

  if (platform === 'facebook') {
    if (!window.FB) {
      errorMessage.value = "Facebook SDK chưa sẵn sàng!";
      return;
    }

    // BẬT LOADING cho nút Sign In gốc
    authStore.loading = true; 

    window.FB.login((response) => {
      if (response.authResponse) {
        processFacebookLogin(response);
      } else {
        // TẮT LOADING nếu user hủy
        authStore.loading = false; 
        errorMessage.value = "Bạn đã hủy đăng nhập Facebook.";
      }
    }, { scope: 'public_profile,email' });
  }

  if (platform === 'google') {
    if (!window.google) {
      errorMessage.value = "Google SDK chưa sẵn sàng!";
      return;
    }

    authStore.loading = true; // Bật xoay nút chính

    window.google.accounts.id.initialize({
      client_id: "646063209072-qdlcsk4hacgbsvs8okibdgquieoc3rn1.apps.googleusercontent.com",
      callback: handleGoogleResponse,
      use_fedcm_for_prompt: true
    });

    // GỌI PROMPT VỚI CẢNH BÁO CHI TIẾT
    window.google.accounts.id.prompt((notification) => {
      // 1. Trường hợp bảng chọn bị ẩn/bỏ qua (Skipped)
      if (notification.isSkippedMoment()) {
        authStore.loading = false;
        console.warn("Google One Tap skipped");
        // Hiển thị thông báo nhẹ nhàng để user biết tại sao không thấy gì hiện ra
        errorMessage.value = "Bảng chọn Google đang bị ẩn. Vui lòng thử lại sau hoặc refresh trang (F5).";
      }

      // 2. Trường hợp người dùng chủ động bấm nút đóng (Dismissed)
      if (notification.isDismissedMoment()) {
        authStore.loading = false;
        const reason = notification.getDismissedReason();
        console.log("User dismissed reason:", reason);
        
        if (reason === 'credential_returned') {
          // Đây là lúc Token đã được gửi về callback, không cần báo lỗi
          return;
        }
        errorMessage.value = "Bạn đã đóng cửa sổ đăng nhập Google.";
      }
      
      // 3. Trường hợp bảng chọn không thể hiển thị (ví dụ: do Cooldown)
      // Lưu ý: isNotDisplayed() có thể không hoạt động ở một số trình duyệt mới do FedCM
      if (notification.isNotDisplayed && notification.isNotDisplayed()) {
         authStore.loading = false;
         errorMessage.value = "Không thể hiển thị đăng nhập Google. Vui lòng dùng Email hoặc Facebook.";
      }
    });
  }
};

// Tạo hàm phụ riêng để xử lý async/await
const processFacebookLogin = async (response) => {
  try {
    if (response.authResponse) {
      const token = response.authResponse.accessToken;
      const success = await authStore.loginWithFacebook(token);
      if (success) {
        router.push('/');
      }
    } else {
      errorMessage.value = "Bạn đã hủy đăng nhập Facebook.";
    }
  } catch (err) {
    console.error("Lỗi xử lý FB Login:", err);
    errorMessage.value = "Đã xảy ra lỗi khi kết nối server.";
  }
};

const handleGoogleResponse = async (response) => {
  try {
    // response.credential chính là mã JWT Google trả về
    const success = await authStore.loginWithGoogle(response.credential);
    if (success) {
      router.push('/');
    }
  } catch (err) {
    errorMessage.value = "Lỗi đăng nhập Google!";
  }
};
</script>
<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>