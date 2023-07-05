import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';

import Login from './components/Login.vue';
import Home from './components/Home.vue';

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Login },
    { path: '/home/:username', name: 'Home', component: Home }, // Add the dynamic parameter :username
  ],
});

app.use(router);

app.mount('#app');
