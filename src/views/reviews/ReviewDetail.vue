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
  
      <!-- Sección de Comentarios -->
      <el-card class="comments-section">
        <h3>Comentarios</h3>
  
        <!-- Lista de comentarios -->
        <div v-if="comments.length > 0">
        <div v-for="comment in comments" :key="comment.id" class="comment-box">
            <strong>{{ comment.username }}</strong>
            <p>{{ comment.content }}</p>
            <small>{{ formatDate(comment.created_at) }}</small>
        </div>
        </div>
        <el-empty v-else description="Aún no hay comentarios. Sé el primero en comentar." />
  
        <!-- Formulario de comentario (solo para usuarios autenticados) -->
        <el-form v-if="isLoggedIn" ref="commentForm">
          <el-form-item>
            <el-input v-model="newComment" placeholder="Escribe un comentario..." type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="postComment" :loading="loading">Comentar</el-button>
          </el-form-item>
        </el-form>
        <el-alert v-else title="Debes iniciar sesión para comentar" type="info" show-icon />
      </el-card>
  
      <el-button link @click="goBack" >Volver</el-button>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useAuthStore } from '@/store/authStore';
  import { supabase } from '@/lib/supabase';
  import dayjs from 'dayjs';
  
  // Router y autenticación
  const route = useRoute();
  const router = useRouter();
  const authStore = useAuthStore();
  const user = computed(() => authStore.user);
  const isLoggedIn = computed(() => !!authStore.user);
  
  // Estado para la reseña y comentarios
  const review = ref(null);
  const comments = ref([]);
  const newComment = ref('');
  const loading = ref(false);
  
  // Obtener la reseña por ID
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
  
  // Obtener comentarios de la reseña
  const fetchComments = async () => {
    const { id } = route.params;
    const { data, error } = await supabase
      .from('comments')
      .select('id, content, created_at, profiles (username)')
      .eq('review_id', id)
      .order('created_at', { ascending: true });
  
    if (error) console.error(error);
    else {
      comments.value = data.map(comment => ({
        ...comment,
        username: comment.profiles?.username || 'Anónimo'
      }));
    }
  };
  
  // Publicar un comentario
  const postComment = async () => {
    if (!newComment.value.trim()) return;
  
    loading.value = true;
    const { id } = route.params;
  
    const { error } = await supabase.from('comments').insert({
      review_id: id,
      user_id: user.value.id,
      content: newComment.value
    });
  
    loading.value = false;
  
    if (error) {
      console.error('Error al agregar comentario:', error.message);
    } else {
      newComment.value = ''; // Limpiar campo
      fetchComments(); // Refrescar comentarios
    }
  };
  
  // Formatear fecha
  const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');
  
  // Volver a la página anterior
  const goBack = () => {
    router.push('/');
  };
  
  // Cargar datos al montar el componente
  onMounted(async () => {
    await fetchReview();
    await fetchComments();
  });
  </script>
  
  <style scoped>

    .comment-box {
    background: #f9f9f9;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 5px;
    border-left: 4px solid #409eff; /* Color azul de Element Plus */
    }
    .comment-box strong {
    display: block;
    color: #333;
    }
    .comment-box small {
    color: #777;
    font-size: 0.9rem;
    }

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
  .comments-section {
    margin-top: 20px;
    padding: 20px;
  }
  </style>
  