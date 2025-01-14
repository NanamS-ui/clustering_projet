<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Backends</h1>
    <div class="bg-white rounded-lg shadow">
      <div class="p-6">
        <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Backend
        </button>
      </div>
      <div class="border-t">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Servers</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
              <td class="px-6 py-4">web-backend</td>
              <td class="px-6 py-4">2 servers</td>
              <td class="px-6 py-4">http</td>
              <td class="px-6 py-4">
                <button class="text-blue-500 hover:text-blue-700">Edit</button>
                <button class="text-red-500 hover:text-red-700 ml-4">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>