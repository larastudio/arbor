<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import Sidebar from './Sidebar.vue';
import Canvas from './Canvas.vue';
import BuilderNav from '@/Components/BuilderNav.vue'; // Import BuilderNav component
</script>

<template>
   <Head title="Builder" />
   <AuthenticatedLayout>
      <!-- Header is now directly within Canvas.vue, not via slot -->
      <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <div class="header-container">
                  <h2 class="font-semibold text-xl text-gray-800 leading-tight">Builder</h2>
				    <!-- Add BuilderNav here for the Save button -->
                  <BuilderNav />
              </div>
          </div>
      </header>

      <div class="builder">
        <Sidebar />
        <Canvas />
      </div>
    </AuthenticatedLayout>
  </template>

<style scoped>
  .builder {
      display: flex;
  }
  .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between; /* Optional: to push the BuilderNav to the right */
  }
</style>
