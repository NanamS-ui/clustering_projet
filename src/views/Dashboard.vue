<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { haproxyApi } from '../services/api';
import { ChartBarIcon, ServerIcon, ArrowPathIcon } from '@heroicons/vue/24/outline';

const stats = ref({
  version: '',
  uptime: '',
  connections: 0,
  frontendCount: 0,
  backendCount: 0
});

const loading = ref(true);

const fetchStats = async () => {
  try {
    const info = await haproxyApi.getInfo();
    const frontends = await haproxyApi.getFrontends();
    const backends = await haproxyApi.getBackends();

    console.log('Frontends:', frontends);  // Afficher la structure de la réponse

    const frontendCount = Array.isArray(frontends) ? frontends.length : 0;

    stats.value = {
      version: info.version,
      uptime: info.build_date,
      //connections: info.total_connections,
      frontendCount: frontendCount,  // Utilisation de la longueur du tableau
      backendCount: backends.length  // On suppose que backends est aussi un tableau
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
  } finally {
    loading.value = false;
  }
};


onMounted(fetchStats);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Dashboard</h1>
      <button @click="fetchStats"
        class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
        <ArrowPathIcon class="h-5 w-5 mr-2" />
        Refresh
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm opacity-75">HAProxy Version</p>
            <p class="text-2xl font-bold mt-1">{{ stats.version ||'N/A' }}</p>
          </div>
          <ServerIcon class="h-8 w-8 opacity-75" />
        </div>
        <div class="mt-4">
          <p class="text-sm opacity-75">Uptime</p>
          <p class="text-lg mt-1">{{ stats.uptime ||'N/A' }}</p>
        </div>
      </div>

      <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm opacity-75">Configuration</p>
            <p class="text-2xl font-bold mt-1">{{ stats.frontendCount }} Frontends</p>
          </div>
          <ChartBarIcon class="h-8 w-8 opacity-75" />
        </div>
        <div class="mt-4">
          <p class="text-lg">{{ stats.backendCount }} Backends</p>
        </div>
      </div>

      <!-- <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm opacity-75">Total Connections</p>
            <p class="text-2xl font-bold mt-1">{{ 'N/A' }}</p>
          </div>
          <ServerIcon class="h-8 w-8 opacity-75" />
        </div>
        <div class="mt-4">
          <div class="w-full bg-white/20 rounded-full h-2">
            <div class="bg-white rounded-full h-2" style="width: 70%"></div>
          </div>
        </div>
      </div> -->
    </div>

    <!-- <div class="mt-8 bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button @click="haproxyApi.applyConfiguration()"
          class="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
          Apply Configuration
        </button>
        <button
          class="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Backup Configuration
        </button>
      </div>
    </div> -->
  </div>
</template>