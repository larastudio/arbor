<template>
	<div class="canvas" ref="canvas" @dragenter="blockEvent" @dragover="blockEvent" @drop="onDrop">
	  <Module 
		v-for="module in modules" 
		:key="module.id" 
		:module="module" 
		:canvasWidth="canvasWidth"
		:canvasHeight="canvasHeight"
		@update:data="updateModuleData(module.id, $event)" 
	  />
	</div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { modules, addModule, updateModuleData } from '../classes/Module';
  import Module from '../Components/Module.vue'; // Import the common Module component
  
  // Canvas dimensions
  const canvas = ref(null);
  const canvasWidth = ref(0);
  const canvasHeight = ref(0);
  
  // Prevent default drag/drop behavior
  const blockEvent = (event) => {
	event.preventDefault();
  };
  
  // Handle drop event
  const onDrop = (event) => {
	event.preventDefault();
	const data = event.dataTransfer.getData('application/json');
  
	if (data) {
	  try {
		const moduleData = JSON.parse(data);
		const canvasRect = event.target.getBoundingClientRect();
		addModule(moduleData, canvasRect, event);
	  } catch (error) {
		console.error('Error parsing dropped data:', error);
	  }
	}
  };
  
  // Function to move module - must be defined before use
  let movingModule = null;
  let initialMousePosition = { x: 0, y: 0 };
  
  const moveModule = (event) => {
	if (movingModule) {
	  const deltaX = event.pageX - initialMousePosition.x;
	  const deltaY = event.pageY - initialMousePosition.y;
  
	  let newX = movingModule.props.x + deltaX;
	  let newY = movingModule.props.y + deltaY;
  
	  // Constrain within canvas boundaries
	  newX = Math.max(0, Math.min(newX, canvasWidth.value - movingModule.props.width));
	  newY = Math.max(0, Math.min(newY, canvasHeight.value - movingModule.props.height));
  
	  movingModule.props.x = newX;
	  movingModule.props.y = newY;
  
	  initialMousePosition = { x: event.pageX, y: event.pageY };
	}
  };
  
  const stopMove = () => {
	window.removeEventListener('mousemove', moveModule);
	window.removeEventListener('mouseup', stopMove);
	movingModule = null;
  };
  
  // Update canvas dimensions when mounted
  onMounted(() => {
	if (canvas.value) {
	  const rect = canvas.value.getBoundingClientRect();
	  canvasWidth.value = rect.width;
	  canvasHeight.value = rect.height;
	}
  
	// Optionally, update canvas dimensions on window resize
	window.addEventListener('resize', handleResize);
  });
  
  // Handle window resize event
  const handleResize = () => {
	if (canvas.value) {
	  const rect = canvas.value.getBoundingClientRect();
	  canvasWidth.value = rect.width;
	  canvasHeight.value = rect.height;
	}
  };
  
  // Cleanup event listeners when component is unmounted
  onBeforeUnmount(() => {
	if (typeof moveModule === 'function') {
	  window.removeEventListener('mousemove', moveModule);
	}
	if (typeof stopMove === 'function') {
	  window.removeEventListener('mouseup', stopMove);
	}
	window.removeEventListener('resize', handleResize);
  });
  </script>
  
  <style scoped>
  .canvas {
	width: 100%;
	height: 600px;
	border: 1px solid #ccc;
	position: relative;
	background-color: #f0f0f0;
  }
  
  .module {
	position: absolute;
	border: 1px solid red;
	padding: 0;
	margin: 0;
	box-sizing: border-box;
  }
  
  .resize-handle {
	width: 10px;
	height: 10px;
	background-color: blue;
	position: absolute;
	bottom: 0;
	right: 0;
	cursor: nwse-resize;
  }
  </style>
  