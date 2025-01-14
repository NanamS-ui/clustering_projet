<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Settings</h1>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="max-w-2xl">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Config File Path
          </label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            value="/etc/haproxy/haproxy.cfg"
          >
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Stats Socket
          </label>
          <input
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md"
            value="/var/run/haproxy.sock"
          >
        </div>
        <div>
          <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>