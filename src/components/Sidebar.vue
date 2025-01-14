<script setup lang="ts">
import { ref } from 'vue';
import { HomeIcon, ServerStackIcon, Cog6ToothIcon, ChartBarIcon } from '@heroicons/vue/24/outline';
import { useRoute } from 'vue-router';

const route = useRoute();

const menuItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/' },
  { name: 'Frontends', icon: ServerStackIcon, path: '/frontends' },
  { name: 'Backends', icon: ServerStackIcon, path: '/backends' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];
</script>

<template>
  <div class="h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white fixed left-0 top-0">
    <div class="p-6">
      <div class="flex items-center space-x-3">
        <ChartBarIcon class="h-8 w-8 text-blue-400" />
        <h1 class="text-xl font-bold">HAProxy Admin</h1>
      </div>
    </div>
    <nav class="mt-8">
      <div 
        v-for="item in menuItems" 
        :key="item.name" 
        class="relative"
      >
        <router-link 
          :to="item.path" 
          class="flex items-center px-6 py-3 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          :class="{ 'bg-gray-700 text-white': route.path === item.path }"
        >
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          <span>{{ item.name }}</span>
          <div 
            v-if="route.path === item.path" 
            class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
          ></div>
        </router-link>
      </div>
    </nav>
    <div class="absolute bottom-0 left-0 right-0 p-6">
      <div class="flex items-center space-x-3 text-sm text-gray-400">
        <div class="w-2 h-2 rounded-full bg-green-500"></div>
        <span>System Online</span>
      </div>
    </div>
  </div>
</template>