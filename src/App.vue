<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
</script>

<template>
  <div class="flex">
    <Sidebar />
    <main class="ml-64 flex-1 p-8">
      <router-view></router-view>
    </main>
  </div>
</template>