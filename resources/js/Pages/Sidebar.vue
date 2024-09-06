<template>
    <div class="sidebar">
      <draggable
        :list="availableModules"
        :group="{ name: 'modules', pull: 'clone', put: false }"
        item-key="id"
      >
        <template #item="{ element }">
          <div class="module-item">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import draggable from 'vuedraggable';
  
  
  const availableModules = ref([
    { id: 1, name: 'Image Module', component: 'ImageModule', props: { src: 'https://via.placeholder.com/150' } },
    { id: 2, name: 'Text Module', component: 'TextModule', props: { text: 'Sample Text' } },
    // More modules here...
  ]);
  </script>
  
  <style scoped>
  .sidebar {
    width: 200px;
    background-color: #fff;
    padding: 10px;
  }
  
  .module-item {
    padding: 10px;
    margin-bottom: 5px;
    border: 1px solid #ccc;
    cursor: grab;
  }
  </style>
  