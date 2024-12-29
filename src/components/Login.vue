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
            router.push('/');
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
  <div class="login-page">
    <h1>Login</h1>
    <form @submit.prevent="login" class="login-form">
      <label for="username">Username</label>
      <input
        id="username"
        type="text"
        v-model="username"
        placeholder="Enter your username"
        required
      />
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        v-model="password"
        placeholder="Enter your password"
        required
      />
      <button type="submit" class="login-button">Login</button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  font-family: Arial, sans-serif;
  color: black;
  background-color: white;
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-size: 1rem;
  font-weight: bold;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-button {
  background-color: #69FF47;
  color: black;
  font-size: 1rem;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #45c934;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}
</style>
