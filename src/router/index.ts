import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/user-info',
    name: 'user-info',
    component: () => import('../views/Info.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/Admin.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
