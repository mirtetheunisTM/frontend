<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

const showConfirm = ref(false);
const currentAction = ref('');

function askConfirmation(action) {
  currentAction.value = action;
  showConfirm.value = true;
}

function handleConfirmation(action) {
  if (action === 'logout') {
    logout();
  }
  showConfirm.value = false;
}

function handleCancel() {
  showConfirm.value = false;
}

function changePassword() {
    router.push('/change-password');
}

function logout() {
    const token = localStorage.getItem('token');

    fetch('https://backend-lc9k.onrender.com/users/logout', {
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
  <div class="bg-black min-h-screen flex flex-col items-center text-center">
    <!-- Page Title and Description -->
    <div class="mt-10">
      <h1 class="text-customGreen text-4xl font-bold mb-4 mt-8">Profile</h1>
      <p class="text-gray-400 text-lg p-2">
        You are logged in as an Admin and therefore you have access to the Dashboard and Order Overviews.
      </p>
    </div>

    <!-- Buttons -->
    <div class="flex flex-col items-center mt-40 mb-auto">
      <button 
        @click="changePassword()" 
        class="mb-8 bg-customGreen text-black px-6 py-3 rounded-3xl text-lg font-semibold hover:bg-green-600 transition"
      >
        Change Password
      </button>
      <button 
        @click="askConfirmation('logout')" 
        class="bg-red-800 text-white px-6 py-3 rounded-3xl text-lg font-semibold hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirm" class="fixed inset-0 flex justify-center items-center backdrop-blur-sm bg-customGray bg-opacity-50">
      <div class="bg-white p-5 rounded-3xl">
        <p class="text-lg mb-8 text-black">Are you sure you want to {{ currentAction }}?</p>
        <div class="flex justify-center gap-8">
          <button 
            class="bg-customGreen mb-4 text-black px-8 py-2 rounded-3xl"
            @click="handleConfirmation(currentAction)">
            Yes
          </button>
          <button 
            class="bg-customGray mb-4 text-white px-8 py-2 rounded-3xl"
            @click="handleCancel">
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
