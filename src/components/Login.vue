<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

async function login() {
    error.value = '';

    try {
        const response = await fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username.value,
                password: password.value,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            let token = data.data.token;
            localStorage.setItem('token', token);
            router.push('/dashboard');
        } else {
            error.value = data.message || 'Login failed. Please try again.';
        }
    } catch (err) {
        error.value = 'An unexpected error occurred.';
        console.error(err);
    }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-black">
    <div class="w-full max-w-sm p-6 bg-black rounded-lg">
      <div class="flex justify-center mb-8">
        <img src="/SWEAR_Logo_white.png" alt="SWEAR Logo" class="h-12" />
      </div>
      <h1 class="text-center text-3xl font-bold text-customGreen text-400 mb-6">Login</h1>
      <p v-if="error" class="text-center text-red-500">{{ error }}</p>
      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label for="username" class="mt-12 block text-white font-medium">Username</label>
          <input
            id="username"
            type="text"
            v-model="username"
            placeholder="Enter your username"
            class="w-full px-4 py-3 mt-2 text-black bg-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-customGreen"
            required
          />
        </div>
        <div>
          <label for="password" class="block text-white font-medium">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            class="w-full px-4 py-3 mt-2 mb-8 text-black bg-white rounded-3xl focus:outline-none focus:ring-2 focus:ring-customGreen"
            required
          />
        </div>
        <button
          type="submit"
          class="flex justify-center mt-8 w-28 mx-auto py-2 text-lg text-black bg-customGreen rounded-3xl hover:bg-white hover:border-2 hover:border-customGreen"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: 'Neue Haas Grotesk Display Pro', sans-serif;
}
</style>
