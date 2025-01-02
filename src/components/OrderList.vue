<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const orders = ref([]);
const totalOrders = ref(0);
const loading = ref(true);
const error = ref('');
const router = useRouter();

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/orders', {
      headers: {
        Authorization: "Bearer " + localStorage.getItem('token')
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    orders.value = data.data.orders.map(order => ({
      ...order,
      date: formatDate(order.date),
    }));
    totalOrders.value = orders.value.length;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

function goToOrderDetails(orderId) {
  router.push({ name: 'OrderDetail', params: { id: orderId } });
}
</script>

<template>
  <div class="bg-black text-white min-h-screen flex flex-col items-center py-10">
      <h1 class="w-full max-w-5xl mb-20 text-center text-customGreen text-4xl font-bold">Dashboard</h1>
      <p class="w-full max-w-5xl mb-6 text-right text-gray-400 text-lg">Total amount orders: {{ totalOrders }}</p>

    <div v-if="loading" class="text-center text-lg">Loading...</div>
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <ul v-else class="w-full max-w-5xl space-y-4">
      <li 
        v-for="order in orders" 
        :key="order._id" 
        class="flex justify-between items-center bg-customGray text-white rounded-2xl p-5 shadow-[4px_4px_8px_rgba(105,255,71,0.25)]"
      >
        <div>
          <p class="mb-1 text-customGreen text-2xl font-semibold">{{ order.name }}</p>
          <p class="mb-3 text-sm text-gray-400">{{ order.date }}</p>
          <p class="text-md text-white">{{ order.items.length }} items</p>
        </div>
        <div 
          class="w-8 h-8 flex justify-center items-center rounded-full bg-customGreen cursor-pointer"
          @click="goToOrderDetails(order._id)"
        >
          <span class="text-black">&gt;</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style>

</style>
