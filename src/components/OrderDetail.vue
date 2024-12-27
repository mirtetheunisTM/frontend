<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const order = ref(null);
const error = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/orders/${route.params.id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    order.value = data.data;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="order-details-page">
    <h2>Order Details</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="order">
      <p><strong>ID:</strong> {{ order._id }}</p>
      <p><strong>Status:</strong> {{ order.status }}</p>
      <p><strong>Date:</strong> {{ order.date }}</p>
      <!-- Add more fields as needed -->
    </div>
  </div>
</template>

<style scoped>
.order-details-page {
  padding: 20px;
  font-family: 'Arial', sans-serif;
}
</style>
