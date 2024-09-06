<template>
    <div class="builder">
      <Sidebar />
      <Canvas />
    </div>
  </template>
  
  <script setup>
  import Sidebar from './Sidebar.vue';
  import Canvas from './Canvas.vue';
  </script>
  
  <style scoped>
  .builder {
    display: flex;
  }
  </style>
  