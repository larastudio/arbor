<template>
	<div class="canvas" 
		 @dragenter="blockEvent"
		 @dragover="blockEvent"
		 @drop="onDrop">
	  <div
		v-for="module in modules"
		:key="module.id"
		class="module"
		:style="{
		  top: `${module.props.y}px`, 
		  left: `${module.props.x}px`, 
		  width: `${module.props.width}px`, 
		  height: `${module.props.height}px`,
		  position: 'absolute', 
		  border: '1px solid red',
		  overflow: 'hidden'
		}"
	  >
		<component 
		  :is="module.component" 
		  v-bind="getFilteredProps(module.props)" 
		  @update:data="updateModuleData(module.id, $event)" 
		/>
  
		<div class="resize-handle" @mousedown="startResize($event, module)"></div>
	  </div>
	</div>
  </template>  
  
  <script setup>
  import axios from 'axios';
  import { onMounted, onBeforeUnmount } from 'vue';
  import { modules, addModule, getFilteredProps, startResize, updateModuleData } from '../classes/Module';

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
		// Log canvas and event coordinates for comparison
		console.log('Canvas rect:', canvasRect);
		console.log('event.pageX:', event.pageX, 'event.pageY:', event.pageY);
		console.log('Calculated X:', event.pageX - canvasRect.left);
		console.log('Calculated Y:', event.pageY - canvasRect.top);
		console.log('Drop target:', event.target); // Ensure the target is the canvas
		addModule(moduleData, canvasRect, event);
	  } catch (error) {
		console.error('Error parsing dropped data:', error);
	  }
	}
  };
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
	border: 1px solid red; /* For visibility */
	padding: 0;
	margin: 0;  /* Ensure no margin */
	box-sizing: border-box; /* Include border in width/height calculation */
}

  
  /* Resizing handle styles */
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
  