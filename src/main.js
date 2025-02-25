// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import router from './router';

const app = createApp(App); //Crea la instancia de la aplicación vue

app.use(ElementPlus); // Activamos Element Plus
app.use(createPinia()); // Activamos Pinia
app.use(router); // Activamos Vue Router

app.mount('#app'); // Montamos la aplicación en el div con id app
