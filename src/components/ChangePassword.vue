<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const oldPassword = ref('');
const newPassword = ref('');
const error = ref('');
const successMessage = ref('');
const router = useRouter();

async function changePassword() {
    error.value = '';
    successMessage.value = '';

    const token = localStorage.getItem('token');

    try {
        const response = await fetch('https://backend-lc9k.onrender.com/users/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                oldPassword: oldPassword.value,
                newPassword: newPassword.value,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            successMessage.value = data.message;
            oldPassword.value = '';
            newPassword.value = '';
        } else {
            error.value = data.message || 'Failed to change password';
        }
    } catch (err) {
        console.error(err);
        error.value = 'An unexpected error occurred';
    }
}
</script>

<template>
  <div class="bg-black min-h-screen flex flex-col justify-center items-center py-10">
    <!-- Page Title -->
    <h1 class="text-customGreen text-4xl font-bold mb-20 -mt-10">Change Password</h1>

    <!-- Form -->
    <form 
      @submit.prevent="changePassword" 
      class="bg-customGray p-6 py-10 rounded-3xl shadow-lg w-full max-w-md text-center"
    >

      <!-- Error Message -->
      <p v-if="error" class="mt-4 mb-8 text-red-800 text-sm">{{ error }}</p>
      <p v-if="successMessage" class="mt-4 mb-8 text-customGreen text-sm">{{ successMessage }}</p>

      <!-- Old Password -->
      <div class="mb-8">
        <label for="oldPassword" class="block text-white font-semibold mb-2">Old Password</label>
        <input 
          id="oldPassword" 
          type="password" 
          v-model="oldPassword" 
          placeholder="Enter your old password" 
          class="w-full px-4 py-2 rounded-3xl bg-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"
          required 
        />
      </div>

      <!-- New Password -->
      <div class="mb-10">
        <label for="newPassword" class="block text-white font-semibold mb-2">New Password</label>
        <input 
          id="newPassword" 
          type="password" 
          v-model="newPassword" 
          placeholder="Enter your new password" 
          class="w-full px-4 py-2 rounded-3xl bg-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-customGreen"
          required 
        />
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        class="w-full bg-customGreen text-black px-3 py-2 rounded-3xl text-lg font-semibold hover:bg-green-600 transition"
      >
        Change Password
      </button>
    </form>

    <!-- Back Button -->
    <button 
      @click="$router.push('/dashboard')" 
      class="mt-8 bg-customGray text-gray-300 px-4 py-2 rounded-3xl text-lg font-semibold hover:bg-customGreen hover:text-black transition"
    >
      Back to Dashboard
    </button>
  </div>
</template>

<style scoped>

</style>
