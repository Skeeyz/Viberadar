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
      
      <div id="google-hidden-btn" class="hidden"></div>

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
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import SocialButtons from '@/components/auth/SocialButtons.vue';

const authStore = useAuthStore();
const router = useRouter();

import { ref, onMounted } from 'vue';
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const rememberMe = ref(false);

onMounted(() => {
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
  if (!validateForm()) return;
  const success = await authStore.signIn(email.value, password.value);
  if (success) {
    if (rememberMe.value) {
      localStorage.setItem('remembered_email', email.value);
    } else {
      localStorage.removeItem('remembered_email');
    }
    router.push('/'); 
  }
};

const handleSocialLogin = (platform) => {
  if (authStore.loading) return;
  errorMessage.value = ''; 

  if (platform === 'facebook') {
    if (!window.FB) {
      errorMessage.value = "Facebook SDK chưa sẵn sàng!";
      return;
    }
    authStore.loading = true; 
    window.FB.login((response) => {
      if (response.authResponse) {
        processFacebookLogin(response);
      } else {
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

    authStore.loading = true;

    window.google.accounts.id.initialize({
      client_id: "646063209072-qdlcsk4hacgbsvs8okibdgquieoc3rn1.apps.googleusercontent.com",
      callback: handleGoogleResponse,
      ux_mode: "popup",
      use_fedcm_for_prompt: true
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification.isSkippedMoment() || (notification.isNotDisplayed && notification.isNotDisplayed())) {
        console.warn("One Tap bị chặn. Đang kích hoạt tự động Popup...");

        const container = document.getElementById("google-hidden-btn");
        
        // 1. Tạo Observer để theo dõi khi nào nút Google thực sự xuất hiện trong DOM
        const observer = new MutationObserver((mutations) => {
          // Tìm iframe của Google trước, vì nút bấm nằm trong Iframe đó
          const iframe = container.querySelector('iframe');
          
          // Đợi cho đến khi iframe xuất hiện và có trạng thái sẵn sàng
          if (iframe) {
            // Thử tìm nút bấm bên trong container (Google render nút bao quanh iframe)
            const hiddenBtn = container.querySelector('[role="button"]');
            if (hiddenBtn) {
              // ĐẶT MỘT KHOẢNG TRỄ CỰC NGẮN (vài ms) ĐỂ IFRAME KỊP LOAD NỘI DUNG
              setTimeout(() => {
                hiddenBtn.click();
                observer.disconnect();
                authStore.loading = false;
              }, 50); // 50ms là đủ để bypass các trễ mạng nhỏ
            }
          }
        });

        // Bắt đầu quan sát container của nút ẩn
        observer.observe(container, { childList: true, subtree: true });

        // 2. Ra lệnh render nút (vẫn để ẩn hoặc kích thước 0)
        window.google.accounts.id.renderButton(container, { 
          theme: "outline", 
          size: "large" 
        });

        // 3. (Phòng hờ) Nếu sau 2s vẫn không click được thì nhả loading để tránh treo
        setTimeout(() => {
          observer.disconnect();
          if (authStore.loading) authStore.loading = false;
        }, 2000);
      }

      if (notification.isDismissedMoment()) {
        const reason = notification.getDismissedReason();
        if (reason !== 'credential_returned') {
          authStore.loading = false;
          errorMessage.value = "Bạn đã đóng cửa sổ đăng nhập Google.";
        }
      }
    });
  }
};

const processFacebookLogin = async (response) => {
  try {
    const token = response.authResponse.accessToken;
    const success = await authStore.loginWithFacebook(token);
    if (success) router.push('/');
  } catch (err) {
    errorMessage.value = "Đã xảy ra lỗi khi kết nối server.";
  } finally {
    authStore.loading = false;
  }
};

const handleGoogleResponse = async (response) => {
  try {
    const success = await authStore.loginWithGoogle(response.credential);
    if (success) router.push('/');
  } catch (err) {
    errorMessage.value = "Lỗi đăng nhập Google!";
  } finally {
    authStore.loading = false;
    // Ẩn lại nút ẩn nếu nó đang hiện
    document.getElementById("google-hidden-btn").classList.add('hidden');
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>