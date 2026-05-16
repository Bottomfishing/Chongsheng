import { onUnmounted, ref, watch, type Ref } from "vue";

export function useTypewriter(
  source: Ref<string>,
  options?: {
    enabled?: Ref<boolean>;
    charDelay?: number;
    startDelay?: number;
  },
) {
  const displayed = ref("");
  const isTyping = ref(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  function clearTimer() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function runTypewriter(text: string) {
    clearTimer();
    displayed.value = "";
    isTyping.value = true;

    if (!text) {
      isTyping.value = false;
      return;
    }

    const enabled = options?.enabled?.value ?? true;
    if (!enabled) {
      displayed.value = text;
      isTyping.value = false;
      return;
    }

    const charDelay = options?.charDelay ?? 32;
    const startDelay = options?.startDelay ?? 80;
    let index = 0;

    const tick = () => {
      displayed.value = text.slice(0, index);
      index += 1;
      if (index <= text.length) {
        timer = setTimeout(tick, charDelay);
      } else {
        isTyping.value = false;
      }
    };

    timer = setTimeout(tick, startDelay);
  }

  watch(
    source,
    (text) => {
      runTypewriter(text);
    },
    { immediate: true },
  );

  onUnmounted(clearTimer);

  return { displayed, isTyping };
}
