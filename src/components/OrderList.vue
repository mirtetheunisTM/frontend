<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const orders = ref([]);
const totalOrders = ref(0);
const loading = ref(true);
const error = ref('');
const filters = ref({
  name: '',
  status: '',
  sort: '',
  order: 'asc'
});
const router = useRouter();

let primus;

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function fetchOrders() {
  try {
    loading.value = true;
    const { name, status, sort, order } = filters.value;

    // Build query string with filters and sorting
    let query = `?sort=${sort}&order=${order}`;
    if (name) query += `&name=${name}`;
    if (status) query += `&status=${status}`;

    const response = await fetch(`https://backend-lc9k.onrender.com/api/v1/orders${query}`, {
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
}

onMounted(async () => {
  try {
    const response = await fetch('https://backend-lc9k.onrender.com/api/v1/orders' /*'http://localhost:3000/api/v1/orders'*/, {
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

  primus = new Primus('https://backend-lc9k.onrender.com/');
  primus.on('data', (message) => {
    switch (message.event) {
      case 'order-added':
        console.log(message.data);
        orders.value.push({
          ...message.data,
          date: formatDate(message.data.date),
        });
        totalOrders.value += 1;
        break;
      case 'order-deleted':
        orders.value = orders.value.filter(order => order._id !== message.data.orderId);
        totalOrders.value -= 1;
        break;
      case 'order-updated':
        const index = orders.value.findIndex(order => order._id === message.data._id);
        if (index !== -1) {
          orders.value[index] = {
            ...message.data,
            date: formatDate(message.data.date),
          };
        }
        break;
    }
  });
});

onUnmounted(() => {
  if (primus) {
    primus.end();
  }
})

function goToOrderDetails(orderId) {
  router.push({ name: 'OrderDetail', params: { id: orderId } });
}
</script>

<template>
  <div class="bg-black text-white min-h-screen flex flex-col items-center py-10">
      <h1 class="w-full max-w-5xl mb-20 text-center text-customGreen text-4xl font-bold">Dashboard</h1>

      <!-- Filtering and Sorting Controls -->
      <div class="flex space-x-4 mb-6">
        <select v-model="filters.name" @change="fetchOrders" class="bg-customGray text-white p-2 rounded-3xl">
          <option value="">Filter by Name</option>
          <option v-for="order in orders" :key="order._id" :value="order.name">{{ order.name }}</option>
        </select>
        
        <select v-model="filters.status" @change="fetchOrders" class="bg-customGray text-white p-2 rounded-3xl">
          <option value="">Filter by Status</option>
          <option value="in productie">In productie</option>
          <option value="verzonden">Verzonden</option>
          <option value="geleverd">Geleverd</option>
          <option value="geannuleerd">Geannuleerd</option>
          <option value="teruggestuurd">Teruggestuurd</option>
        </select>

        <select v-model="filters.sort" @change="fetchOrders" class="bg-customGray text-white p-2 rounded-3xl">
          <option value="">Sort by</option>
          <option value="name">Sort by Name</option>
          <option value="date">Sort by Date</option>
        </select>

        
        <select v-model="filters.order" @change="fetchOrders" class="bg-customGray text-white p-2 rounded-3xl">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <p class="w-full max-w-5xl mb-6 text-right text-gray-400 text-lg">Total amount orders: {{ totalOrders }}</p>

    <div v-if="loading" class="text-center text-lg">Loading...</div>
    <div v-if="error" class="text-center text-red-500">{{ error }}</div>

    <ul v-else class="grid grid-cols-1 gap-5 w-full max-w-5xl">
      <li 
        v-for="order in orders" 
        :key="order._id" 
        class="flex justify-between items-center bg-customGray text-white rounded-3xl p-5 w-full box-border"
      >
        <div>
          <p class="mb-1 text-customGreen text-2xl font-semibold">{{ order.name }}</p>
          <p class="mb-3 text-sm text-gray-400">{{ order.date }}</p>
          <p class="text-md text-white">{{ order.status }} - €{{ order.totalPrice }}</p>
        </div>
        <div 
          class="w-8 h-8 flex justify-center items-center cursor-pointer"
          @click="goToOrderDetails(order._id)"
        >
          <img src="../assets/chevron-right.svg" alt="See Details" class="filter w-8 h-8" style="filter: invert(76%) sepia(78%) saturate(433%) hue-rotate(52deg) brightness(98%) contrast(106%);">
        </div>
      </li>
    </ul>
  </div>
</template>

<style>

</style>
