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
        const response = await fetch('http://localhost:3000/users/changePassword', {
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
  <div class="change-password">
    <h1>Change Password</h1>
    <form @submit.prevent="changePassword" class="change-password-form">
      <label for="oldPassword">Old Password</label>
      <input
        id="oldPassword"
        type="password"
        v-model="oldPassword"
        placeholder="Enter your old password"
        required
      />
      <label for="newPassword">New Password</label>
      <input
        id="newPassword"
        type="password"
        v-model="newPassword"
        placeholder="Enter your new password"
        required
      />
      <button type="submit" class="change-password-button">Change Password</button>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
    </form>
    <button @click="$router.push('/')" class="back-button">Back to Dashboard</button>
  </div>
</template>

<style scoped>
.change-password {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}

.change-password-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.change-password-button {
  background-color: #69ff47;
  color: black;
  font-size: 1rem;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.change-password-button:hover {
  background-color: #45c934;
}

.back-button {
  margin-top: 20px;
  background-color: #ccc;
  color: black;
  padding: 10px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #aaa;
}

.error-message {
  color: red;
  font-size: 0.9rem;
}

.success-message {
  color: green;
  font-size: 0.9rem;
}
</style>
