<template>
    <div class="canvas" @dragover.prevent @drop="onDrop">
      <draggable
        v-model="modules"
        :group="{ name: 'modules', pull: true, put: true }"
        item-key="id"
        @add="onDrop"
        @start="drag=true" 
        @end="drag=false" 
      >
        <template #item="{ element }">
          <div class="module">
            <component :is="element.component" v-bind="element.props" />
          </div>
        </template>
      </draggable>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import draggable from 'vuedraggable';
  
  const modules = ref([]);
  
  // Handles drop events and logs information
  const onDrop = (event) => {
    console.log('Drop event:', event);
    
    // Check if the item is being added successfully
    if (event.added) {
      console.log('Item added:', event.added);
    } else {
      console.log(event.dataTransfer);
      console.warn('Drop failed or no item added:', event);
    }
  };
  </script>
  
  <style scoped>
  .canvas {
    width: 100%;
    height: 600px;
    min-height: 600px;
    border: 1px solid #ccc;
    position: relative;
    background-color: #f0f0f0;
  }
  
  .module {
    position: absolute;
  }
  </style>
