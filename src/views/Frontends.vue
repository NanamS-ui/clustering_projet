<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { haproxyApi } from '../services/api';
import { PlusIcon } from '@heroicons/vue/24/outline';

const frontends = ref([]);
const loading = ref(true);  // Loading state
const frontendDetails = ref(null);

const showAddForm = ref(false);
const newFrontend = ref({
  name: '',
  mode: 'http',
  default_backend: '',
  maxconn: 0,
});

const showBindForm = ref(false);
const selectedFrontend = ref(null);
const newBind = ref({
  name: '',
  address: '',
  port: 80,
});

// Fetch frontends with their bind information
const fetchFrontends = async () => {
  try {
    frontends.value = await haproxyApi.getFrontends();
    for (const frontend of frontends.value) {
      frontend.binds = await haproxyApi.getBindsForFrontend(frontend.name);
    }
  } catch (error) {
    console.error('Failed to fetch frontends:', error);
  } finally {
    loading.value = false;
  }
};

// Fetch details of a selected frontend
const fetchFrontendDetails = async (frontendName: string) => {
  try {
    const response = await haproxyApi.getFrontendDetails(frontendName);
    frontendDetails.value = response;
  } catch (error) {
    console.error('Failed to fetch frontend details:', error);
  }
};

// Add a new frontend
const addFrontend = async () => {
  try {
    const cfgVersion = await haproxyApi.getVersion();
    await haproxyApi.createFrontend(newFrontend.value, cfgVersion);
    showAddForm.value = false;
    fetchFrontends();
  } catch (error) {
    console.error('Failed to add frontend:', error);
  }
};

// Add a new bind
const addBind = async (frontend = null) => {
  try {
    selectedFrontend.value = frontend;
    showBindForm.value = true;
    // Reset newBind object when opening the form
    newBind.value = { name: '', address: '', port: 80 };
  } catch (error) {
    console.error('Failed to add bind:', error);
  }
};

// Submit the bind form
const submitBind = async () => {
  try {
    const cfgVersion = await haproxyApi.getVersion();
    const bindData = {
      name: newBind.value.name,
      address: newBind.value.address,
      port: newBind.value.port,
    };
    await haproxyApi.createBind(selectedFrontend.value.name, bindData, cfgVersion);
    showBindForm.value = false;
    fetchFrontends();
  } catch (error) {
    console.error('Failed to add bind:', error);
  }
};

const deleteFrontend = async (frontendName: string) => {
  try {
    const cfgVersion = await haproxyApi.getVersion();
    await haproxyApi.deleteFrontend(frontendName, cfgVersion);
    fetchFrontends();
  } catch (error) {
    console.error('Failed to delete frontend:', error);
  }
};

onMounted(fetchFrontends);
</script>


<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Frontends</h1>
      <button @click="showAddForm = !showAddForm"
        class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        <PlusIcon class="h-5 w-5 mr-2" />
        Add Frontend
      </button>
    </div>

    <!-- Add frontend form -->
    <div v-if="showAddForm" class="mb-6 bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Add New Frontend</h2>
      <form @submit.prevent="addFrontend">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="newFrontend.name" type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Mode</label>
            <select v-model="newFrontend.mode"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300">
              <option value="http">HTTP</option>
              <option value="tcp">TCP</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Default Backend</label>
            <input v-model="newFrontend.default_backend" type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Max Connections</label>
            <input v-model.number="newFrontend.maxconn" type="number" min="1"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required />
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Save
          </button>
          <button type="button" @click="showAddForm = false"
            class="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Frontend list -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bind</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="frontend in frontends" :key="frontend.name">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  <a href="#" @click.prevent="fetchFrontendDetails(frontend.name)">{{ frontend.name }}</a>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  <div v-if="frontend.binds && frontend.binds.length > 0">
                    <div v-for="bind in frontend.binds" :key="bind.address" class="text-gray-500">
                      {{ bind.address }}:{{ bind.port }}
                    </div>
                  </div>
                  <div v-else class="text-gray-500">
                    <div class="text-sm font-medium text-gray-900">
                      <a href="#" @click.prevent="addBind(frontend)"> Add Bind</a>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ frontend.mode || 'http' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                <button class="text-red-600 hover:text-red-900" @click="deleteFrontend(frontend.name)">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add bind form -->
    <!-- Add bind form -->
    <div v-if="showBindForm" class="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-bold mb-4">Add Bind to {{ selectedFrontend?.name }}</h2>
      <form @submit.prevent="submitBind">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input v-model="newBind.name" type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <input v-model="newBind.address" type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Port</label>
            <input v-model.number="newBind.port" type="number" min="1" max="65535"
              class="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              required />
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Save
          </button>
          <button type="button" @click="showBindForm = false"
            class="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>

  </div>
</template>
