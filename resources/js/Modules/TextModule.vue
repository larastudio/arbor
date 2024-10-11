<template>
    <div class="text-module">
      {{ text }}
    </div>
  </template>
  
  <script setup>
  defineProps({
    text: String
  });
  </script>
  
  <style scoped>

.text-module {
  font-size: 16px;
  color: #333;
  /* Ensure text fills the entire module area */
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box; /* Make sure padding/border do not exceed width/height */
}
  </style>
  