<template>
    <div class="review-detail-container">
      <el-card v-if="review" class="review-card" shadow="hover">
        <h1>{{ review.title }}</h1>
        <p class="author"><strong>Autor:</strong> {{ review.author }}</p>
        <el-divider />
        <p class="content">{{ review.content }}</p>
        <el-divider />
        <p class="review-meta">
          Publicado por: {{ review.username }} | {{ formatDate(review.created_at) }}
        </p>
      </el-card>
  
      <el-empty v-else description="Cargando reseña..." />
      <el-button @click="goBack" type="text">Volver</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { supabase } from '@/lib/supabase';
  import dayjs from 'dayjs';
  
  // Router
  const route = useRoute();
  const router = useRouter();
  
  // Estado para la reseña
  const review = ref(null);
  
  // Función para obtener la reseña por ID
  const fetchReview = async () => {
    const { id } = route.params;
  
    const { data, error } = await supabase
      .from('reviews')
      .select('id, title, author, content, created_at, profiles (username)')
      .eq('id', id)
      .single();
  
    if (error) console.error(error);
    else {
      review.value = {
        ...data,
        username: data.profiles?.username || 'Anónimo'
      };
    }
  };
  
  onMounted(fetchReview);
  
  // Formatear fecha
  const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');
  
  // Volver a la página anterior
  const goBack = () => {
    router.push('/');
  };
  </script>
  
  <style scoped>
  .review-detail-container {
    max-width: 800px;
    margin: 40px auto;
    padding: 20px;
    text-align: left;
  }
  .review-card {
    padding: 20px;
    border-radius: 8px;
  }
  .author {
    font-size: 1.1rem;
    color: #555;
  }
  .content {
    font-size: 1.2rem;
    line-height: 1.6;
  }
  .review-meta {
    font-size: 0.9rem;
    color: #888;
  }
  .el-button {
    margin-top: 20px;
  }
  </style>
  