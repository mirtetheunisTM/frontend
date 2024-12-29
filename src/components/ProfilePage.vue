<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function changePassword() {
    router.push('/change-password');
}

function logout() {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/users/logout', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === 'success') {
                localStorage.removeItem('token');
                alert('Logged out successfully');
                router.push('/login');
            } else {
                alert('Failed to log out');
            }
        })
        .catch((err) => {
            console.error(err);
            alert('An error occurred while logging out');
        });
}
</script>

<template>
  <div class="profile-page">
    <h1>Profile</h1>
    <button @click="changePassword" class="profile-button">
      Change Password
    </button>
    <button @click="logout" class="logout-button">
      Logout
    </button>
  </div>
</template>

<style scoped>
.profile-page {
  font-family: Arial, sans-serif;
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
}

h1 {
  margin-bottom: 30px;
}

.profile-button,
.logout-button {
  margin: 10px 0;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.profile-button {
  background-color: #69ff47;
  color: black;
}

.profile-button:hover {
  background-color: #45c934;
}

.logout-button {
  background-color: red;
  color: white;
}

.logout-button:hover {
  background-color: darkred;
}
</style>
