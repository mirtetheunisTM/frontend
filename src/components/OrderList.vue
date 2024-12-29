<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const orders = ref([]);
const totalOrders = ref(0);
const loading = ref(true);
const error = ref('');
const router = useRouter();;

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}


onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/v1/orders', {
      'headers': {
        'Authorization': "Bearer " + localStorage.getItem('token')
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
  router.push({ name: 'OrderDetail', params: { id: orderId }});
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
  <div class="order-list">
    <h2>Dashboard</h2>
    <div class="orders-counter">
      <p v-if="loading">Loading...</p>
      <p v-if="error" class="error">{{ error }}</p>
      <p v-else>Total Orders: {{ totalOrders }}</p>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-else>
      <li v-for="order in orders" :key="order._id" class="order-item">
        <div class="order-details">
          <p class="order-name">{{ order.name }}</p>
          <p class="order-date">{{ order.date }}</p>
          <p class="order-status">{{ order.status }}</p>
        </div>
        <button class="details-button" @click="goToOrderDetails(order._id)">
          Details
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.order-list {
  font-family: 'Arial', sans-serif;
  color: black;
  background-color: white;
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

h2 {
  text-align: center;
  font-size: 1.8rem;
  margin-bottom: 40px;
}

.loading, .error {
  text-align: center;
  color: black;
  font-size: 1.2rem;
}

ul {
  list-style: none;
  padding: 0;
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  color: white; 
  padding: 15px 30px;
  margin-bottom: 10px;
  border-radius: 40px;
}

.order-details {
  display: flex;
  flex-direction: column;
}

.order-name {
  font-size: 1.3rem;
  color: #69FF47;
}

.order-date {
    font-size: 0.8rem;
    color: white;
    margin-top: -10px;
}

.order-status {
  font-size: 1rem;
  color: white;
  font-weight: bold;
}

.details-button {
  background-color: #69FF47;
  color: black;
  border: none;
  padding: 8px 15px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.details-button:hover {
  background-color: white; 
  color: black; 
  border: 2px solid #69FF47;
}

.logout-button,
.change-password-button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button {
  background-color: red;
  color: white;
}

.logout-button:hover {
  background-color: darkred;
}

.change-password-button {
  background-color: #69ff47;
  color: black;
}

.change-password-button:hover {
  background-color: #45c934;
}
</style>
