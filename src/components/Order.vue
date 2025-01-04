<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const partMaterials = JSON.parse(localStorage.getItem('materials'));
const partColors = JSON.parse(localStorage.getItem('colors'));

localStorage.removeItem('materials');
localStorage.removeItem('colors');

// Add custom properties
const shoeChar = {};

for (const part in partMaterials) {
    const material = partMaterials[part]; 

    if (material != null) {
        shoeChar[part] = material;
    }
}

for (const part in partColors) {
    const color = partColors[part];
    const material = partMaterials[part];

    if (color == '0xffffff' && material != null) {
        console.log(color)
    } else {
        shoeChar[part] = color;
    }
}

// Calculate total price
const basePrice = 70;
const additionalCost = 1; // Each "leather" or "suede" part adds €1
let totalPrice = basePrice;

// Check for "leather" or "suede" parts and calculate additional cost
Object.values(shoeChar).forEach(value => {
    if (value === 'leather' || value === 'suede') {
        totalPrice += additionalCost;
    }
});

// Form data and methods
const name = ref('');
const lastName = ref('');
const email = ref('');
const street = ref('');
const houseNumber = ref('');
const zipCode = ref('');
const city = ref('');
const country = ref('');

// Submit order
const shoeCharJSON = JSON.stringify(shoeChar);

const orderShoe = () => {
    const orderData = {
        name: name.value + ' ' + lastName.value,
        email: email.value,
        address: street.value + ' ' + houseNumber.value + ' - ' + zipCode.value + ' ' + city.value,
        country: country.value,
        shoeCharJSON, 
        totalPrice
    };
    
    console.log('Order Data:', orderData);
};

function goBack() {
    router.go(-1);
}
</script>

<template>
    <div class="bg-black min-h-screen p-8">
      <h1 class="text-4xl font-bold text-customGreen text-center mb-8">Order your customized shoe</h1>
      
      <div class="max-w-5xl mx-auto bg-customGray p-10 rounded-3xl">
        <!-- Order Form -->
        <form @submit.prevent="orderShoe">
          <div class="space-y-4">
            
            <!-- Name: First Name and Last Name on the same row -->
            <div class="flex space-x-6">
              <div class="flex-1">
                <label class="block text-white mb-3 mx-3">First Name</label>
                <input type="text" v-model="name" class="w-full p-4 rounded-3xl bg-customGray text-white border-2 border-gray-600 focus:border-customGreen" placeholder="Enter your first name" required />
              </div>
              <div class="flex-1">
                <label class="block text-white mb-3 mx-3">Last Name</label>
                <input type="text" v-model="lastName" class="w-full p-4 mb-4 rounded-3xl bg-customGray text-white border-2 border-gray-600 focus:border-customGreen" placeholder="Enter your last name" required />
              </div>
            </div>
  
            <!-- Email -->
            <div>
              <label class="block text-white mb-3 mx-3">Email</label>
              <input type="email" v-model="email" class="w-full p-4 mb-4 rounded-3xl bg-customGray text-white border-2 border-gray-600 focus:border-customGreen" placeholder="Enter your email" required />
            </div>
  
            <!-- Street: Street and House Number on the same row -->
            <div class="flex space-x-6">
              <div class="flex-1">
                <label class="block text-white mb-3 mx-3">Street</label>
                <input type="text" v-model="street" class="w-full p-4 rounded-3xl bg-customGray text-white border-2 border-gray-600 focus:border-customGreen" placeholder="Enter your street" required />
              </div>
              <div class="flex-1">
                <label class="block text-white mb-3 mx-3">House Number</label>
                <input type="text" v-model="houseNumber" class="w-full mb-4 p-4 rounded-3xl bg-customGray text-white border-2 border-gray-600 focus:border-customGreen" placeholder="Enter your house number" required />
              </div>
            </div>
  
            <!-- Zip Code: Zip Code and City on the same row -->
            <div class="flex space-x-6">
              <div class="flex-1">
                <label class="block text-white mb-3 mx-3">Zip Code</label>
                <input type="text" v-model="zipCode" class="w-full p-4 rounded-3xl bg-customGray text-white border-2 border-gray-600 focus:border-customGreen" placeholder="Enter your zip code" required />
              </div>
              <div class="flex-1">
                <label class="block text-white mb-3 mx-3">City</label>
                <input type="text" v-model="city" class="w-full mb-4 p-4 rounded-3xl bg-customGray text-white border-2 border-gray-600 focus:border-customGreen" placeholder="Enter your city" required />
              </div>
            </div>
  
            <!-- Country -->
            <div>
              <label class="block text-white mb-3 mx-3">Country</label>
              <select v-model="country" class="w-full p-4 mb-4 rounded-3xl bg-customGray text-white border-2 border-gray-600 focus:border-customGreen" required>
                <option value="" disabled selected>Select your country</option>
                <option value="Belgium">Belgium</option>
                <option value="The Netherlands">The Netherlands</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="France">France</option>
                <option value="Germany">Germany</option>
              </select>
            </div>
  
            <!-- Total Price -->
            <div>
              <p class="text-white text-lg mb-4">Total: <strong>€{{ totalPrice }}</strong></p>
            </div>
  
            <!-- Order Button -->
            <div class="flex space-x-6">
                <div class="flex-1">
                    <button type="button" class="w-full py-2 px-4 bg-customGray text-gray-300 rounded-3xl font-bold border-2 border-customGreen hover:bg-customGreen hover:text-black" @click="goBack">Back</button>
                </div>
                <div class="flex-1">
                    <button type="submit" class="w-full py-2 px-4 bg-customGreen text-black rounded-3xl font-bold hover:bg-green-600">
                    Order
                    </button>
                </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>

<style scoped>

</style>