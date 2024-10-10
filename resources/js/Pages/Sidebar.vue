<template>
    <div class="sidebar">
      <div
        class="module-item"
        v-for="module in availableModules"
        :key="module.id"
        :data-module-id="module.id"
        draggable="true"
        @dragstart="onNativeDragStart"
      >
        {{ module.name }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import ImageModule from '../Modules/ImageModule.vue';
  import TextModule from '../Modules/TextModule.vue';
  
  // Define available modules
  const availableModules = ref([
    {
      id: 1,
      name: 'Image Module',
      componentName: 'ImageModule', // Only pass the name of the component
      props: { src: 'https://via.placeholder.com/150' }
    },
    {
      id: 2,
      name: 'Text Module',
      componentName: 'TextModule',
      props: { text: 'Sample Text' }
    }
  ]);
  
  // On drag start, set the dataTransfer object
  const onNativeDragStart = (event) => {
    const moduleId = event.target.dataset.moduleId;
    const draggedModule = availableModules.value.find(
      (module) => module.id === parseInt(moduleId)
    );
    if (event.dataTransfer && draggedModule) {
      const moduleData = {
        id: draggedModule.id,
        name: draggedModule.name,
        componentName: draggedModule.componentName, // Only pass the component name
        props: draggedModule.props
      };
      event.dataTransfer.setData('application/json', JSON.stringify(moduleData));
      console.log('Setting data in dataTransfer:', moduleData);
    }
  };
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
  