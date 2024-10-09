<template>
    <p>{{ text }}</p>
  </template>
  
  <script setup>
  defineProps({
    text: String,
  });
  </script>
  
  <style scoped>
  p {
    font-size: 16px;
    color: #333;
  }
  </style>
  