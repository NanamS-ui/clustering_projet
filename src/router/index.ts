import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/frontends',
      name: 'Frontends',
      component: () => import('../views/Frontends.vue'),
    },
    {
      path: '/backends',
      name: 'Backends',
      component: () => import('../views/Backends.vue'),
    },
    {
      path: '/settings',
      name: 'Settings',
      component: () => import('../views/Settings.vue'),
    },
  ],
});

export default router;