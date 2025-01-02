<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToProfile() {
    router.push('/profile');
}
</script>

<template>
  <header class="flex justify-between items-center p-5 bg-black text-white">
    <img
      src="/SWEAR_Logo_white.png"
      alt="Swear Logo"
      class="mx-8h-12 cursor-pointer"
      @click="$router.push('/dashboard')"
    />
    <button
      class="mx-8 bg-customGreen text-black py-1 px-5 text-lg rounded-3xl cursor-pointer transition-colors duration-300 hover:bg-green-600"
      @click="goToProfile"
    >
      Profile
    </button>
  </header>
</template>

<style scoped>
</style>