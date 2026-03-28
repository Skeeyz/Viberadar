<template>
  <div class="flex flex-col items-center">
    <form @submit.prevent="handleSignUp" class="w-full space-y-4">
      
      <Transition name="fade">
        <div v-if="successMsg" class="bg-green-500/10 border border-green-500/50 text-green-500 text-sm py-2 px-4 rounded-lg text-center">
          {{ successMsg }}
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="errorMessage || authStore.error" class="bg-red-500/10 border border-red-500/50 text-red-500 text-sm py-2 px-4 rounded-lg text-center">
          {{ errorMessage || authStore.error }}
        </div>
      </Transition>

      <div class="relative">
        <input v-model="name" type="text" placeholder="Name" required
          class="w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
      </div>

      <div class="relative">
        <input v-model="email" type="email" placeholder="Email" required
          class="w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
      </div>

      <div class="relative">
        <input v-model="password" type="password" placeholder="Password" required
          class="w-full bg-gray-800/60 border-none rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all" />
      </div>

      <div class="flex items-start gap-2 text-sm text-gray-400 mt-2">
        <input type="checkbox" id="agree" v-model="isAgree" class="accent-cyan-500 w-4 h-4 mt-1 cursor-pointer" />
        <label for="agree" class="cursor-pointer leading-relaxed">
          I agree to the <span class="text-orange-500 hover:underline">Privacy Policy</span> and terms.
        </label>
      </div>

      <button type="submit" :disabled="!isAgree || authStore.loading"
        class="w-full py-3 bg-transparent border border-cyan-500 text-white rounded-lg font-bold tracking-widest hover:bg-cyan-500/20 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
        <span v-if="authStore.loading" class="flex items-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          CREATING ACCOUNT...
        </span>
        <span v-else>SIGN UP</span>
      </button>

      <SocialButtons @social-click="handleSocialLogin" actionType="Sign up with" />
      
      <div id="google-hidden-btn" class="hidden"></div>

      <div class="text-center mt-6 text-sm text-gray-400">
        Already have an account? 
        <router-link to="/auth/signin" class="text-orange-500 font-medium hover:underline ml-1">Sign in!</router-link>
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

const name = ref('');
const email = ref('');
const password = ref('');
const isAgree = ref(false);
const successMsg = ref('');
const errorMessage = ref('');

const validateForm = () => {
  errorMessage.value = '';
  if (name.value.length < 2) {
    errorMessage.value = "Tên phải có ít nhất 2 ký tự";
    return false;
  }
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

const handleSignUp = async () => {
  if (!validateForm()) return;

  const success = await authStore.signUp(name.value, email.value, password.value);
  
  if (success) {
    successMsg.value = 'Đăng ký thành công! Đang chuyển hướng...';
    setTimeout(() => {
      router.push('/auth/signin');
    }, 2000);
  } else {
    errorMessage.value = authStore.error;
  }
};

// Cập nhật hàm handleSocialLogin tương tự bên SignIn
const handleSocialLogin = (platform) => {
  if (authStore.loading) return;
  errorMessage.value = '';

  if (platform === 'facebook') {
    if (!window.FB) {
      errorMessage.value = "Facebook SDK chưa sẵn sàng!";
      return;
    }

    authStore.loading = true; // Bật loading cho nút chính

    window.FB.login((response) => {
      if (response.authResponse) {
        processFacebookSignUp(response);
      } else {
        authStore.loading = false; // Tắt loading nếu hủy
        errorMessage.value = "Hủy đăng ký qua Facebook.";
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

const processFacebookSignUp = async (response) => {
  try {
    const token = response.authResponse.accessToken;
    const success = await authStore.loginWithFacebook(token);
    if (success) {
      router.push('/');
    }
  } catch (err) {
    errorMessage.value = "Lỗi kết nối Facebook.";
  } finally {
    authStore.loading = false;
  }
};

const handleGoogleResponse = async (response) => {
  try {
    const success = await authStore.loginWithGoogle(response.credential);
    if (success) {
      router.push('/');
    }
  } catch (err) {
    errorMessage.value = "Lỗi đăng ký Google!";
  } finally {
    authStore.loading = false;
  }
};

onMounted(() => {
  if (window.FB) console.log("SignUpView: FB SDK Ready");
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>