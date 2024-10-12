<template>
    <div class="builder-nav">
      <PrimaryButton @click="saveModules">Save</PrimaryButton>
    </div>
  </template>
  
  <script setup>
    import PrimaryButton from '@/Components/PrimaryButton.vue';
    import { saveModules } from '../classes/Module';  // Import the saveModules function

  </script>
  
  <style scoped>
  .builder-nav {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }
  </style>
  