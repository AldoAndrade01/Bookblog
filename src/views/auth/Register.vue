<template>
    <div class="auth-container">
      <h1>Registro 📝</h1>
  
      <el-form :model="form" :rules="rules" ref="registerForm" label-width="100px">
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
  
        <el-form-item label="Contraseña" prop="password">
          <el-input type="password" v-model="form.password" />
        </el-form-item>
  
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="handleSignUp" :loading="authStore.loading">
            Registrarse
          </el-button>
        </el-form-item>
  
        <el-alert v-if="authStore.error" :title="authStore.error" type="error" show-icon />
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
  
  const registerForm = ref(null);
  const form = ref({
    email: '',
    password: '',
    username: ''
  });
  
  const rules = {
    email: [{ required: true, message: 'Por favor ingresa tu email', trigger: 'blur' }],
    password: [{ required: true, message: 'Por favor ingresa tu contraseña', trigger: 'blur' }],
    username: [{ required: true, message: 'Por favor ingresa un username', trigger: 'blur' }]
  };
  
  const handleSignUp = async () => {
    await authStore.signUp(form.value);
  
    if (!authStore.error) {
      ElMessage.success('Registro exitoso. Ahora puedes iniciar sesión.');
      router.push('/login');
    }
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
  </style>
  