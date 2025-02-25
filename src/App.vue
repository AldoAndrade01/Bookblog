<template>
  <div id="app">
    <!-- Barra de Navegación -->
    <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="1" @click="goHome">Inicio</el-menu-item>

      <el-menu-item v-if="!isLoggedIn" index="2" @click="goLogin">Iniciar Sesión</el-menu-item>

      <!-- Botón para ir al panel de admin -->
      <el-menu-item v-if="isLoggedIn" index="3" @click="goAdmin">Panel Admin</el-menu-item>

      <!-- Menú de usuario -->
      <el-sub-menu v-if="isLoggedIn" index="4">
        <template #title>
          👤 {{ userName }}
        </template>
        <el-menu-item @click="logout">Cerrar Sesión</el-menu-item>
      </el-sub-menu>
    </el-menu>

    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { ElMessage } from 'element-plus';
import { computed } from 'vue';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const authStore = useAuthStore();
const isLoggedIn = computed(() => !!authStore.user);
const userName = computed(() => authStore.user?.email || 'Usuario');

const goHome = () => router.push('/');
const goLogin = () => router.push('/login');

// Nuevo método para ir al panel admin
const goAdmin = async () => {
  if (!authStore.user) {
    ElMessage.error('Debes iniciar sesión');
    return;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authStore.user.id)
    .single();

  if (error) {
    ElMessage.error('Error al verificar el rol');
    console.error(error);
    return;
  }

  if (data?.role === 'admin') {
    router.push('/admin');
  } else {
    ElMessage.error('No tienes permisos para acceder al Panel de Administrador');
  }
};

const logout = async () => {
  await authStore.signOut();
  ElMessage.success('Sesión cerrada');
  router.push('/');
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  margin: 0;
  padding: 0;
}

.el-menu {
  display: flex;
  justify-content: center;
  padding: 10px;
}
</style>
