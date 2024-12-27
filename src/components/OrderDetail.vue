<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const order = ref(null);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/orders/${route.params.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch order details');
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
  <div>
    <h2>Order Details</h2>
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <p><strong>ID:</strong> {{ order.id }}</p>
      <p><strong>Name:</strong> {{ order.name }}</p>
      <p><strong>Status:</strong> {{ order.status }}</p>
      <!-- Add other fields as needed -->
    </div>
  </div>
</template>
