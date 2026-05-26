import { ref, computed } from "vue";
import { apiFetch } from "@/services/api";

const token = ref<string | null>(localStorage.getItem("auth_token"));
const currentUser = ref<{ id: number; username: string } | null>(null);
const isAuthenticated = computed(() => !!token.value);

export function useAuth() {
  async function login(username: string, password: string) {
    const data = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    token.value = data.access_token;
    currentUser.value = data.user;
    localStorage.setItem("auth_token", data.access_token);
  }

  async function register(username: string, password: string) {
    const data = await apiFetch("/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    token.value = data.access_token;
    currentUser.value = data.user;
    localStorage.setItem("auth_token", data.access_token);
  }

  async function fetchMe() {
    try {
      const data = await apiFetch("/me");
      currentUser.value = data;
    } catch {
      token.value = null;
      currentUser.value = null;
      localStorage.removeItem("auth_token");
    }
  }

  function logout() {
    token.value = null;
    currentUser.value = null;
    localStorage.removeItem("auth_token");
  }

  return { token, currentUser, isAuthenticated, login, register, fetchMe, logout };
}
