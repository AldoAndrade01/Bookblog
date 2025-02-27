// src/store/authStore.js
import { defineStore } from 'pinia';
import { supabase } from '@/lib/supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,           // Datos del usuario autenticado
    loading: false,       // Para mostrar spinners o loaders durante operaciones
    error: null           // Para almacenar errores
  }),

  actions: {
    // Función para REGISTRAR un nuevo usuario
  async signUp({ email, password, username }) {
    this.loading = true;
    this.error = null;

    try {
      // Registrar usuario con Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) throw error;

      // Esperar unos segundos y obtener el usuario autenticado
      let user;
      for (let i = 0; i < 5; i++) {  // Intentos de reintento
        const { data: sessionData } = await supabase.auth.getSession();
        user = sessionData?.session?.user;
        if (user) break;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
      }

      if (!user) throw new Error("No se pudo obtener el usuario después del registro.");

      //console.log("Usuario registrado con ID:", user.id);

      // Crear el perfil en la tabla profiles
      await supabase.from('profiles').insert({
        id: user.id, // Aseguramos que el ID sea el correcto
        username,
        role: 'user'  // Por defecto asignamos el rol 'user'
      });

      this.user = user;
    } catch (err) {
      this.error = err.message;
      console.error("Error en el registro:", err.message);
    } finally {
      this.loading = false;
    }
  },


    // Función para INICIAR SESIÓN
    async signIn({ email, password }) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Actualizar el estado del usuario
        this.user = data.user;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Función para CERRAR SESIÓN
    async signOut() {
      this.loading = true;
      this.error = null;

      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        this.user = null;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },

    // Función para obtener la sesión activa (al recargar la página)
    async fetchUser() {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
    
        this.user = data?.user || null;
      } catch (err) {
        console.error("Error al obtener el usuario:", err.message);
        this.user = null;  // Asegurarse de resetear el usuario en caso de error
      }
    }    
  }
});
