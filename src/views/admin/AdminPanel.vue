<template>
    <div class="admin-container">
      <el-card class="admin-card" shadow="hover">
        <h1>Panel de Administrador 📚</h1>
  
        <!-- Cargando mientras se verifica el rol -->
        <el-skeleton v-if="loading" :rows="4" animated />
  
        <!-- Acceso Denegado -->
        <div v-else-if="!isAdmin">
          <el-alert type="error" title="Acceso Denegado" description="No tienes permisos para acceder a este panel." show-icon />
        </div>
  
        <!-- Formulario para agregar reseñas -->
        <div v-else>
          <el-form :model="form" :rules="rules" ref="reviewForm" label-width="120px">
            <el-form-item label="Título" prop="title">
              <el-input v-model="form.title" placeholder="Título del libro" />
            </el-form-item>
  
            <el-form-item label="Autor" prop="author">
              <el-input v-model="form.author" placeholder="Nombre del autor" />
            </el-form-item>
  
            <el-form-item label="Contenido" prop="content">
              <el-input type="textarea" v-model="form.content" placeholder="Escribe la reseña aquí..." :rows="5" />
            </el-form-item>
  
            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="submitting">Agregar Reseña</el-button>
            </el-form-item>
  
            <el-alert v-if="error" :title="error" type="error" show-icon />
            <el-alert v-if="success" title="Reseña agregada exitosamente" type="success" show-icon />
          </el-form>
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from '@/store/authStore';
  import { supabase } from '@/lib/supabase';
  import { ElMessage } from 'element-plus';
  
  // Acceso al store de autenticación
  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  
  // Estados
  const isAdmin = ref(false);
  const loading = ref(true);  // Cargando al inicio
  const submitting = ref(false); // Estado para el botón de enviar
  const error = ref(null);
  const success = ref(false);
  
  // Formulario
  const reviewForm = ref(null);
  const form = ref({
    title: '',
    author: '',
    content: ''
  });
  
  const rules = {
    title: [{ required: true, message: 'Ingresa el título', trigger: 'blur' }],
    author: [{ required: true, message: 'Ingresa el autor', trigger: 'blur' }],
    content: [{ required: true, message: 'Ingresa el contenido', trigger: 'blur' }]
  };
  
  // Verificar rol del usuario
  const checkAdminRole = async () => {
    if (!user.value) {
      console.error('Usuario no autenticado');
      loading.value = false;
      return;
    }
  
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.value.id)
      .single();
  
    if (error) {
      console.error('Error al obtener el rol:', error.message);
      loading.value = false;
      return;
    }
  
    console.log('Rol obtenido:', data?.role);
  
    if (data?.role === 'admin') {
      isAdmin.value = true;
    } else {
      isAdmin.value = false;
    }
  
    loading.value = false;
  };
  
  // Manejar el envío del formulario
  const handleSubmit = async () => {
    error.value = null;
    success.value = false;
  
    // Validar el formulario
    reviewForm.value.validate(async (valid) => {
      if (valid) {
        submitting.value = true;
  
        const { data, error: insertError } = await supabase.from('reviews').insert({
          title: form.value.title,
          author: form.value.author,
          content: form.value.content,
          user_id: user.value.id  // Relaciona la reseña al usuario autenticado
        });
  
        submitting.value = false;
  
        if (insertError) {
          error.value = insertError.message;
          ElMessage.error('Error al agregar la reseña');
        } else {
          success.value = true;
          ElMessage.success('Reseña agregada exitosamente');
          form.value = { title: '', author: '', content: '' }; // Limpiar formulario
        }
      } else {
        ElMessage.error('Por favor completa todos los campos requeridos');
      }
    });
  };
  
  // Al montar el componente
  onMounted(async () => {
    await authStore.fetchUser();  // Asegúrate de que el usuario esté disponible
    await checkAdminRole();
  });
  </script>
  
  <style scoped>
  .admin-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
  }
  
  .admin-card {
    padding: 20px;
    border-radius: 12px;
    text-align: center;
  }
  </style>
  