import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import AdminPanel from '@/views/admin/AdminPanel.vue';
import ReviewDetail from '@/views/reviews/ReviewDetail.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/admin', name: 'AdminPanel', component: AdminPanel },
  { path: '/review/:id', name: 'ReviewDetail', component: ReviewDetail, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
