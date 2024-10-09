<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head } from '@inertiajs/vue3';
import Sidebar from './Sidebar.vue';
import Canvas from './Canvas.vue';
</script>

<template>
   <Head title="Builder" />
   <AuthenticatedLayout>
      <template #header>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Builder</h2>
      </template>
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
  