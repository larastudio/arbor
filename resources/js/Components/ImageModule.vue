<template>
    <img :src="src" :alt="alt" class="image-module" />
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    src: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
  });
  </script>
  
  <style scoped>
  .image-module {
    width: 100%;
    height: auto;
  }
  </style>
  