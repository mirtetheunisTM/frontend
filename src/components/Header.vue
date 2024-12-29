<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToProfile() {
    router.push('/profile');
}
</script>

<template>
  <header class="header">
    <img
      src="../../public/SWEAR_Logo_white.png"
      alt="Swear Logo"
      class="logo"
      @click="$router.push('/')"
    />
    <button class="profile-button" @click="goToProfile">
      Profile
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: black;
  color: white;
  border-bottom: 2px solid #69ff47;
}

.logo {
  height: 50px;
  cursor: pointer;
}

.profile-button {
  background-color: #69ff47;
  color: black;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.profile-button:hover {
  background-color: #45c934;
}
</style>
