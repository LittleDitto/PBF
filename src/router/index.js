import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/HomePage.vue';
import LoginForm from '@/components/Login/LoginForm.vue';
import AkunPage from '@/components/Akun/AkunPage.vue';
import AkunDetail from '@/components/Detail/AkunDetail.vue';
import AkunCrud from '@/components/Akun/AkunCrud.vue';
import LevelPage from '@/components/Level/LevelPage.vue';
import DetailLanjut from '@/components/Detail/DetailLanjut.vue';
//import Dashboard from '../components/Dashboard.vue';

const routes = [
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/',
    name: 'login',
    component: LoginForm, // Komponen untuk rute utama adalah LoginForm
  },
  {
    path: '/Akun',
    name: 'Akun',
    component: AkunPage,
  },
  {
    path: '/Detail',
    name: 'Detail',
    component: AkunDetail,
  },
  {
    path: '/AkunCrud',
    name: 'AkunCrud',
    component: AkunCrud,
  },
  {
    path: '/LevelPage',
    name: 'LevelPage',
    component: LevelPage,
  },
  {
    path: '/DetailLanjut',
    name: 'DetailLanjut',
    component: DetailLanjut,
  }
//   {
//     path: '/dashboard',
//     name: 'Dashboard',
//     component: Dashboard
//   }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
