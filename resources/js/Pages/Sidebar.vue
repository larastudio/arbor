<template>
    <div class="sidebar">
      <draggable
        :list="availableModules"
        :group="{ name: 'modules', pull: 'clone', put: false }"
        item-key="id"
        @start="onDragStart"
        @end="onDragEnd"
        v-on:dragstart.native="onNativeDragStart"
      >
        <template #item="{ element }">
          <div class="module-item" :data-module-id="element.id">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
  </template>
  
  <script>
  // Global variable to store the module during drag
  export let draggedModuleGlobal = null;
  </script>
  
  <script setup>
  import { ref } from 'vue';
  import draggable from 'vuedraggable';
  import ImageModule from '../Modules/ImageModule.vue';
  import TextModule from '../Modules/TextModule.vue';
  
  // Helper function to deeply clone a reactive object
  const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  
  const availableModules = ref([
    { id: 1, name: 'Image Module', component: ImageModule, props: { src: 'https://via.placeholder.com/150' } },
    { id: 2, name: 'Text Module', component: TextModule, props: { text: 'Sample Text' } },
  ]);
  
  const onDragStart = (event) => {
    console.log('Drag started with vue-draggable:', event);
  };
  
  const onNativeDragStart = (event) => {
    const moduleId = event.target.dataset.moduleId;
  
    // Find the corresponding module data from availableModules
    const draggedModule = availableModules.value.find((module) => module.id === parseInt(moduleId));
  
    if (event.dataTransfer && draggedModule) {
      const plainModule = {
        id: draggedModule.id,
        name: draggedModule.name,
        props: deepClone(draggedModule.props),
      };
  
      // Store the module in the global variable
      draggedModuleGlobal = plainModule;
  
      // Set the dataTransfer with the cleaned module data (properly stringified)
      event.dataTransfer.setData('text/plain', JSON.stringify(plainModule));
      console.log('Setting data in dataTransfer:', plainModule);
    } else {
      console.error('DataTransfer is not available or module is undefined');
    }
  };
  
  const onDragEnd = (event) => {
    console.log('Drag ended:', event);
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
  