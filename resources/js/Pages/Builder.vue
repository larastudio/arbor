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
      <template #header>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Builder</h2>
      </template>

      <!-- Add BuilderNav here for the Save button -->
      <BuilderNav />

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
</style>
