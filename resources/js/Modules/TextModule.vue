<template>
    <div :style="{ top: `${y}px`, left: `${x}px`, position: 'absolute' }">
      {{ text }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    text: String,
    x: Number,
    y: Number
  });
  </script>
  
  <style scoped>
  div {
    font-size: 16px;
    color: #333;
    position: absolute;
  }
  </style>
  