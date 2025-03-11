<template>
  <div class="home-container">
    <el-card class="welcome-card" shadow="hover">
      <h1>Bienvenido al <span class="highlight">Blog de Reseñas de Libros</span> 📚</h1>
    </el-card>

    <!-- Quote Section -->
    <el-card class="quote-card" shadow="hover">
      <p class="quote">{{ quote.quote }}</p>
      <p class="author">- {{ quote.author }}</p>
    </el-card>

    <div class="reviews-container" v-if="reviews.length > 0">
      <el-row :gutter="20">
        <el-col :span="8" v-for="review in reviews" :key="review.id">
          <el-card class="review-card" shadow="hover">
            <h3>{{ review.title }}</h3>
            <p><strong>Autor:</strong> {{ review.author }}</p>
            <p>{{ truncateContent(review.content) }}</p>
            <el-divider />
            <p class="review-meta">Por: {{ review.username }} | {{ formatDate(review.created_at) }}</p>
            <el-button type="primary" @click="goToReview(review.id)">Ver Detalles</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-empty v-else description="No hay reseñas disponibles por ahora." />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/lib/supabase';
import dayjs from 'dayjs';

// Router
const router = useRouter();

// Estado de reseñas
const reviews = ref([]);

// Estado de la cita
const quote = ref({ quote: '', author: '' });

// Obtener reseñas desde Supabase
const fetchReviews = async () => {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, title, author, content, created_at, profiles (username)')
    .order('created_at', { ascending: false });

  if (error) console.error(error);
  else {
    reviews.value = data.map(review => ({
      ...review,
      username: review.profiles?.username || 'Anónimo'
    }));
  }
};

// Obtener cita desde la API
const fetchQuote = async () => {
  try {
    const response = await fetch('https://frasesapi-23qi.onrender.com/quote');
    const data = await response.json();
    quote.value = data;
  } catch (error) {
    console.error('Error fetching quote:', error);
  }
};

onMounted(() => {
  fetchReviews();
  fetchQuote();
});

// Truncar contenido
const truncateContent = (content, length = 100) => {
  return content.length > length ? content.substring(0, length) + '...' : content;
};

// Formatear fecha
const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');

// Redirigir a la vista de detalles
const goToReview = (id) => {
  router.push(`/review/${id}`);
};
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  text-align: center;
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
.quote-card {
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
.quote {
  font-size: 1.2rem;
  font-style: italic;
}
.author {
  font-size: 1rem;
  color: #555;
}
</style>
