import { ref, watch } from 'vue';

export function usePersistedState(key, initial) {
  const raw = localStorage.getItem(key);
  const state = ref(raw ? JSON.parse(raw) : initial);
  watch(state, v => localStorage.setItem(key, JSON.stringify(v)), { deep: true });
  return state;
}
