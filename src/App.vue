<script setup>
import { useRoute } from 'vue-router';
import Header from './components/Header.vue';
import HeaderShop from './components/HeaderShop.vue';

const route = useRoute();

</script>

<template>
  <div>
    <HeaderShop v-if="route.path === '/shop' || route.path === '/order'" />
    <Header v-if="route.path !== '/login' && route.path !== '/shop' && route.path !== '/order'" />
    <router-view />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
