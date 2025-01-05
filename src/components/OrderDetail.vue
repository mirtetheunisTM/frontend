<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const order = ref(null);
const error = ref('');
const loading = ref(true);
// const newStatus = ref('');
const selectedStatus = ref('');
const partsWithValues = reactive({});
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
  console.log("onMounted");
  try {
    console.log("Route param: " + route.params.id);
    const response = await fetch(`https://backend-lc9k.onrender.com/api/v1/orders/${route.params.id}`, {
      'headers': {
        'Authorization': "Bearer " + localStorage.getItem('token')
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    order.value = {
      ...data.data.order,
      date: formatDate(data.data.order.date),
    };
    selectedStatus.value = data.data.order.status;

    const shoeChar = order.value.product;
    const parts = ['inside', 'laces', 'outside_1', 'outside_2', 'outside_3', 'sole_bottom', 'sole_top', 'custom_text'];

    partsWithValues.value = parts.reduce((acc, part) => {
      if (part === 'custom_text') {
        acc[part] = shoeChar[part] || 'No text';
      } else {
      acc[part] = shoeChar[part] || 'ffffff'; 
      }
      return acc;
    }, {});

  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

 async function updateOrderStatus() {
  try {
    const response = await fetch(`https://backend-lc9k.onrender.com/api/v1/orders/${order.value._id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + localStorage.getItem('token') 
    },
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
    const response = await fetch(`https://backend-lc9k.onrender.com/api/v1/orders/${order.value._id}`, {
      method: 'DELETE',
      'headers': {
        'Authorization': "Bearer " + localStorage.getItem('token')
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete order.');
    }
    router.push('/dashboard');
  } catch (err) {
    alert(err.message);
  }
}

console.log(order);
</script>

<template>
  <div class="bg-black min-h-screen flex justify-center items-start py-10 text-white">
    <div v-if="loading" class="text-center text-gray-400 text-xl">
      Loading...
    </div>

    <div v-else-if="error" class="text-center text-red-500 text-xl">
      {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full mt-10">
      <!-- Left Column -->
      <div>
        <!-- Order ID and Date -->
        <div class="mb-20">
          <h2 class="mb-4 text-customGreen font-bold text-2xl">Order ID: {{ order?._id || 'ID unknown'}}</h2>
          <p class="text-gray-400 text-sm">{{ order?.date || 'Date unknown' }}</p>
        </div>

        <!-- Customer Details -->
        <div class="mb-20">
          <h3 class="text-customGreen font-bold text-2xl">Customer Details</h3>
          <p class="mt-4 mb-2"><strong>Name:</strong> {{ order?.name || 'Name unknown' }}</p>
          <p class="mb-2"><strong>Email:</strong> {{ order?.email || 'Email unknown' }}</p>
          <p>
            <strong>Address:</strong> {{ order?.address || 'Address unknown' }}, {{ order?.country || 'Country unknown' }}
          </p>
        </div>

        <!-- Order Status -->
        <div class="mb-6">
          <h3 class="text-customGreen font-bold text-2xl">Status</h3>
          <div class="flex items-center mt-2 space-x-3">
            <select
              v-model="selectedStatus"
              class="bg-customGray text-white px-4 py-2 rounded-3xl border border-gray-600"
            >
              <option
                v-for="option in statusOptions"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
            <button
              @click="updateOrderStatus"
              class="bg-customGreen text-black px-4 py-2 rounded-3xl"
            >
              Update
            </button>
          </div>

          <!-- Back Button -->
          <div class="flex justify-start">
            <button
              @click="router.push('/dashboard')"
              class="flex items-center mt-24 px-4 py-2 border border-gray-400 text-gray-400 rounded-3xl hover:bg-customGreen hover:text-black transition hover:border-customGreen"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-5 h-5 mr-2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div>
        <!-- Products -->
        <div class="mb-6 bg-customGray p-6 rounded-3xl">
          <h3 class="text-customGreen font-bold text-2xl mb-8">Product</h3>
           <div
            v-for="(value, part) in partsWithValues.value"
            :key="part"
            class="mb-2"
          >
            <span>{{  part.replace('_', ' ') }}: {{ value }}</span>
          </div>
          <p class="flex justify-end mt-10 text-lg"><strong>€ {{ order?.totalPrice || 'Total unknown' }}</strong></p>
        </div> 

        <!-- Delete Order Button -->
        <div class="mt-32 flex justify-end">
          <button
            @click="deleteOrder"
            class="mt-5 bg-red-800 text-white px-4 py-2 rounded-3xl w-15 hover:bg-red-700"
          >
            Delete Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
