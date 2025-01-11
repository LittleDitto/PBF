<template>
  <div id="app">
    <router-view></router-view> <!-- Tempat komponen dirender berdasarkan rute -->
  </div>
</template>

<script>
// Tidak perlu mengimpor LoginForm secara manual, karena komponen akan dirender melalui routing
export default {
  name: 'App'
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
