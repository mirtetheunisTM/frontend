<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const order = ref(null);
const error = ref('');
const loading = ref(true);
const newStatus = ref('');
const selectedStatus = ref('');
const statusOptions = ['in productie', 'verzonden', 'geleverd', 'geannuleerd', 'teruggestuurd'];

const route = useRoute();
const router = useRouter();

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/orders/${route.params.id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    order.value = {
      ...data.data.order,
      date: formatDate(data.data.order.date),
    };
    selectedStatus.value = data.data.order.status;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

async function updateOrderStatus() {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/orders/${order.value._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: selectedStatus.value }),
    });
    if (!response.ok) {
      throw new Error('Failed to update status.');
    }
    const updatedOrder = await response.json();
    order.value.status = updatedOrder.data.order.status;
    alert('Status updated successfully.');
  } catch (err) {
    alert(err.message);
  }
}

async function deleteOrder() {
  try {
    const response = await fetch(`http://localhost:3000/api/v1/orders/${order.value._id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete order.');
    }
    router.push('/');
  } catch (err) {
    alert(err.message);
  }
}

console.log(order);
</script>

<template>
  <div class="order-detail">
    <h1>Details Bestelling</h1>
    <p v-if="loading">Loading...</p>
    <p v-if="error" class="error">{{ error }}</p>
    <div v-if="order">
      <div class="order-info">
        <h2>Bestelling ID: {{ order._id }}</h2>
        <p><strong>Datum:</strong> {{ order.date }}</p>
        <div class="status-section">
          <p><strong>Status:</strong></p>
          <select v-model="selectedStatus" class="status-dropdown">
            <option v-for="option in statusOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <button @click="updateOrderStatus" class="update-button">Update</button>
        </div>
      </div>
      <div class="customer-info">
        <h3>Customer Information</h3>
        <p><strong>Naam:</strong> {{ order.name }}</p>
        <p><strong>Email:</strong> {{ order.email }}</p>
        <p><strong>Adres:</strong> {{ order.address }}, {{ order.city }}, {{ order.state }}</p>
      </div>
      <div class="ordered-items">
        <h3>Producten</h3>
        <ul>
          <li v-for="item in order.items" :key="item._id">
            <p><strong>Product:</strong> schoen </p>
            <p><strong>Quantity:</strong> 1 </p>
            <p><strong>Price:</strong> €40</p>
            <p><strong>Total:</strong> €40</p>
          </li>
        </ul>
      </div>
      <div class="order-summary">
        <h3>Totaal bedrag</h3>
        <p><strong>€{{ order.total }}</strong></p>
      </div>
      <div class="actions">
        <button @click="deleteOrder" class="delete-button">Verwijder bestelling</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.order-detail {
  font-family: Arial, sans-serif;
  color: black;
  background-color: white;
  padding: 20px;
  max-width: 800px;
  margin: auto;
}

h1 {
  text-align: center;
  color: black;
}

.order-info, .customer-info, .ordered-items, .order-summary, .actions {
  margin-bottom: 20px;
}

h2, h3 {
  color: #69FF47;
}

.error {
  color: #871614;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background-color: black;
  color: white;
  padding: 15px 30px;
  margin-bottom: 10px;
  border-radius: 40px;
}

.status-input {
  padding: 8px;
  margin-right: 10px;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.status-dropdown {
  padding: 5px;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.update-button, .delete-button {
  padding: 8px 15px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 40px;
  cursor: pointer;
}

.update-button {
  background-color: #69FF47;
  color: black;
  margin-left: 30px;
  border: 2px solid #69FF47;
}

.delete-button {
  background-color: #871614;
  color: white;
  margin-top: 20px;
  border: 2px solid #871614;
}

.update-button:hover {
  background-color: white;
  color: black;
  border: 2px solid #69FF47;
}

.delete-button:hover {
  background-color: white;
  color: #871614;
  border: 2px solid #871614;
}
</style>
