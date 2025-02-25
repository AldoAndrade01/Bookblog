// src/store/userStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);  // Almacena los datos del usuario

  const isLoggedIn = computed(() => !!user.value);  // Devuelve true si hay usuario logueado

  // Función para iniciar sesión
  const login = (userData) => {
    user.value = userData;
  };

  // Función para cerrar sesión
  const logout = () => {
    user.value = null;
  };

  // Devuelve el nombre del usuario o "Invitado"
  const userName = computed(() => user.value?.name || 'Invitado');

  return { user, isLoggedIn, login, logout, userName };
});
