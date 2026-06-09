<template>
  <div class="login-page">
    <div class="login-card">
      <h1 class="login-title">{{ isRegister ? "注册" : "登录" }}</h1>
      <p class="login-subtitle">本地玩家档案，离线可玩</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="请输入用户名"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="请输入密码"
            required
          />
        </div>

        <div v-if="isRegister" class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="再次输入密码"
            required
          />
        </div>

        <p v-if="error" class="error-msg">{{ error }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "请稍候..." : isRegister ? "注册" : "登录" }}
        </button>
      </form>

      <p class="toggle-text">
        {{ isRegister ? "已有账号？" : "没有账号？" }}
        <a href="#" @click.prevent="toggleMode">{{
          isRegister ? "去登录" : "去注册"
        }}</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuth } from "@/composables/useAuth";
import { getActiveLocalPlayer } from "@/utils/localAuth";

const router = useRouter();
const route = useRoute();
const { login, register } = useAuth();

const isRegister = ref(false);
const username = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const loading = ref(false);

onMounted(() => {
  const activePlayer = getActiveLocalPlayer();
  if (activePlayer) {
    const redirect = (route.query.redirect as string) || "/";
    router.replace(redirect);
  }
});

function toggleMode() {
  isRegister.value = !isRegister.value;
  error.value = "";
}

async function handleSubmit() {
  error.value = "";

  if (isRegister.value && password.value !== confirmPassword.value) {
    error.value = "两次密码不一致";
    return;
  }

  loading.value = true;
  try {
    if (isRegister.value) {
      await register(username.value, password.value);
    } else {
      await login(username.value, password.value);
    }
    const redirect = (route.query.redirect as string) || "/";
    router.replace(redirect);
  } catch (e: any) {
    error.value = e?.message || e?.detail || "操作失败，请重试";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  background: rgba(255, 253, 250, 0.92);
  border: 1px solid #d4c5a9;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 8px 32px rgba(61, 41, 20, 0.1);
}

.login-title {
  text-align: center;
  font-size: 1.6rem;
  margin: 0 0 1.8rem;
  color: #3d2914;
}

.login-subtitle {
  margin: -1rem 0 1.4rem;
  text-align: center;
  color: #7b6a55;
  font-size: 0.85rem;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
  color: #5a4a3a;
}

.form-group input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid #c9b896;
  border-radius: 6px;
  font-size: 1rem;
  background: #fffdf9;
  color: #3d2914;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #8b6914;
}

.error-msg {
  color: #c0392b;
  font-size: 0.85rem;
  margin: 0.5rem 0;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 0.8rem;
  background: #3d2914;
  color: #faf8f5;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #5a3e1b;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.toggle-text {
  text-align: center;
  margin-top: 1.2rem;
  font-size: 0.9rem;
  color: #5a4a3a;
}

.toggle-text a {
  color: #8b6914;
  text-decoration: none;
}

.toggle-text a:hover {
  text-decoration: underline;
}
</style>
