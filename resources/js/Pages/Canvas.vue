<template>
	<div class="canvas" @dragover.prevent @drop="onDrop">
	  <draggable
		v-model="modules"
		:group="{ name: 'modules', pull: true, put: true }"
		item-key="id"
		@end="onEnd"
	  >
		<template #item="{ element }">
		  <div class="module" :style="{ top: `${element.props.y}px`, left: `${element.props.x}px`, position: 'absolute' }">
			<component :is="element.component" v-bind="element.props" />
		  </div>
		</template>
	  </draggable>
	</div>
  </template>
  
  <script setup>
  import { ref, watch, markRaw } from 'vue';
  import draggable from 'vuedraggable';
  import ImageModule from '../Modules/ImageModule.vue';
  import TextModule from '../Modules/TextModule.vue';
  import { draggedModuleGlobal } from './Sidebar.vue'; // Import the global variable
  
  const modules = ref([]); // This holds the modules dropped onto the canvas
  
  // Watch for changes in modules array (optional for debugging)
  watch(modules, (newVal) => {
	console.log('Modules array updated:', newVal);
  });
  
  const onDrop = (event) => {
	console.log('Drop event:', event);
  
	let droppedModule;
	const droppedData = event.dataTransfer.getData('text/plain');
	console.log('Raw dropped data from dataTransfer:', droppedData);
  
	// Try parsing the dataTransfer object first
	try {
	  droppedModule = JSON.parse(droppedData);
	} catch (error) {
	  // If parsing fails, fall back to the global draggedModule
	  console.error('Error parsing dropped data. Falling back to global variable:', error);
	  droppedModule = draggedModuleGlobal;
	}
  
	if (!droppedModule) {
	  console.error('No module data available.');
	  return;
	}
  
	console.log('Parsed dropped module:', droppedModule);
  
	let component;
	if (droppedModule.name === 'Image Module') {
	  component = markRaw(ImageModule); // Prevent Vue from making the component reactive
	} else if (droppedModule.name === 'Text Module') {
	  component = markRaw(TextModule); // Prevent Vue from making the component reactive
	}
  
	const canvasRect = event.target.getBoundingClientRect();
	const { clientX, clientY } = event;
  
	const x = clientX - canvasRect.left;
	const y = clientY - canvasRect.top;
  
	console.log(`Adding module at position x: ${x}, y: ${y}`);
  
	modules.value.push({
	  ...droppedModule,
	  component,
	  props: {
		...droppedModule.props,
		x,
		y,
	  },
	});
  
	console.log('Module added to canvas:', modules.value);
  };
  
  const onEnd = (event) => {
	console.log('Drag ended:', event);
  };
  </script>
  
  <style scoped>
  .canvas {
	width: 100%;
	height: 600px;
	min-height: 600px;
	border: 1px solid #ccc;
	position: relative; /* Important for absolute positioning of modules */
  }
  
  .module {
	position: absolute; /* This ensures the module is positioned based on the x and y coordinates */
  }
  </style>
  