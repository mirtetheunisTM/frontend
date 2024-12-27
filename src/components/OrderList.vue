<script setup>
import { ref, onMounted } from 'vue';

const orders = ref([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/orders');
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    console.log(data);
    orders.value = data.data.orders;
    console.log(orders);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <h2>Orders</h2>
    <div v-if="loading">Loading orders...</div>
    <div v-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="order in orders">
          {{ order.name }} - {{ order.status }}
      </li>
    </ul>
  </div>
</template>
