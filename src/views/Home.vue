<template>
  <div class="home-container">
    <el-card class="welcome-card" shadow="hover">
      <h1>Bienvenido al <span class="highlight">Blog de Reseñas de Libros</span> 📚</h1>

      <div v-if="isLoggedIn" class="user-greeting">
        <p>Hola, <strong>{{ userName }}</strong>! 👋</p>
        <el-alert title="Disfruta leyendo y comentando las reseñas" type="success" show-icon />
      </div>

      <div v-else class="login-prompt">
        <p>¿Quieres dejar un comentario? <el-link @click="goLogin" type="primary">Inicia sesión</el-link> o <el-link @click="goRegister" type="success">Regístrate</el-link>.</p>
      </div>
    </el-card>

    <!-- Listado de reseñas -->
    <div class="reviews-container" v-if="reviews.length > 0">
      <el-row :gutter="20">
        <el-col :span="8" v-for="review in reviews" :key="review.id">
          <el-card class="review-card" shadow="hover">
            <h3>{{ review.title }}</h3>
            <p><strong>Autor:</strong> {{ review.author }}</p>
            <p>{{ truncateContent(review.content) }}</p>
            <el-divider />
            <p class="review-meta">Por: {{ review.username }} | {{ formatDate(review.created_at) }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-empty v-else description="No hay reseñas disponibles por ahora." />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

// Router
const router = useRouter();

// Acceso al store de autenticación
const authStore = useAuthStore();
const isLoggedIn = computed(() => !!authStore.user);
const userName = computed(() => authStore.user?.email || 'Invitado');

// Estado para las reseñas
const reviews = ref([]);

// Función para obtener reseñas desde Supabase
const fetchReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id, title, author, content, created_at,
      profiles (username)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    ElMessage.error('Error al cargar las reseñas');
    console.error(error);
  } else {
    // Mapeamos para incluir el nombre del usuario
    reviews.value = data.map((review) => ({
      ...review,
      username: review.profiles?.username || 'Anónimo'
    }));
  }
};

// Ejecutar cuando el componente se monte
onMounted(() => {
  fetchReviews();
});

// Función para truncar el contenido
const truncateContent = (content, length = 100) => {
  return content.length > length ? content.substring(0, length) + '...' : content;
};

// Formatear fecha
const formatDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY');
};

// Navegación
const goLogin = () => router.push('/login');
const goRegister = () => router.push('/register');
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
}

.welcome-card {
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 40px;
}

.highlight {
  color: #409eff;
}

.user-greeting {
  margin-top: 20px;
}

.login-prompt {
  margin-top: 20px;
  font-size: 1.1rem;
}

.reviews-container {
  margin-top: 40px;
}

.review-card {
  padding: 20px;
  border-radius: 8px;
  text-align: left;
}

.review-meta {
  font-size: 0.9rem;
  color: #888;
}

.el-empty {
  margin-top: 40px;
}
</style>
