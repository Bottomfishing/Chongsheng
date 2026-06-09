import { ref, computed } from "vue";
import {
  clearLocalSession,
  getActiveLocalPlayer,
  loginLocalPlayer,
  registerLocalPlayer,
  type PublicPlayer,
} from "@/utils/localAuth";

const activePlayer = getActiveLocalPlayer();
const token = ref<string | null>(activePlayer ? String(activePlayer.id) : null);
const currentUser = ref<PublicPlayer | null>(activePlayer);
const isAuthenticated = computed(() => !!currentUser.value);

export function useAuth() {
  async function login(username: string, password: string) {
    const player = loginLocalPlayer(username, password);
    currentUser.value = player;
    token.value = String(player.id);
  }

  async function register(username: string, password: string) {
    const player = registerLocalPlayer(username, password);
    currentUser.value = player;
    token.value = String(player.id);
  }

  async function fetchMe() {
    const player = getActiveLocalPlayer();
    currentUser.value = player;
    token.value = player ? String(player.id) : null;
  }

  function logout() {
    token.value = null;
    currentUser.value = null;
    clearLocalSession();
  }

  return { token, currentUser, isAuthenticated, login, register, fetchMe, logout };
}
