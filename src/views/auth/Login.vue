<template>
    <div class="auth-container">
      <h1>Iniciar Sesión 🔐</h1>
  
      <el-form :model="form" :rules="rules" ref="loginForm" label-width="100px">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
  
        <el-form-item label="Contraseña" prop="password">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="authStore.loading">
            Iniciar Sesión
          </el-button>
        </el-form-item>
  
        <el-alert v-if="authStore.error" :title="authStore.error" type="error" show-icon />
  
        <!-- Enlace para ir al registro -->
        <p class="register-link">
          ¿No tienes una cuenta? <el-link type="primary" @click="goToRegister">Regístrate aquí</el-link>
        </p>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/store/authStore';
  import { ElMessage } from 'element-plus';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const loginForm = ref(null);
  const form = ref({
    email: '',
    password: ''
  });
  
  const rules = {
    email: [{ required: true, message: 'Por favor ingresa tu email', trigger: 'blur' }],
    password: [{ required: true, message: 'Por favor ingresa tu contraseña', trigger: 'blur' }]
  };
  
  const handleLogin = async () => {
    await authStore.signIn(form.value);
  
    if (!authStore.error) {
      ElMessage.success('Sesión iniciada correctamente');
      router.push('/');
    }
  };
  
  // Función para redirigir al registro
  const goToRegister = () => {
    router.push('/register');
  };
  </script>
  
  <style scoped>
  .auth-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .register-link {
    margin-top: 15px;
  }
  </style>
  