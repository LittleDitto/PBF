import 'mdb-vue-ui-kit/css/mdb.min.css'
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Mengimpor konfigurasi router
import 'mdb-vue-ui-kit/css/mdb.min.css';

createApp(App)
  .use(router) // Menambahkan Vue Router ke aplikasi
  .mount('#app');
