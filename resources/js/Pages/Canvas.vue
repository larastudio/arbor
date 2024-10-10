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
		<!-- Dynamically render the module component, without x and y -->
		<component 
		  :is="module.component" 
		  v-bind="getFilteredProps(module.props)" 
		  @update:data="updateModuleData(module.id, $event)" 
		/>
  
		<!-- Resizing handles -->
		<div class="resize-handle" @mousedown="startResize($event, module)"></div>
	  </div>
	</div>
  </template>
  
  <script setup>
  import { ref, markRaw, onMounted, onBeforeUnmount } from 'vue';
  import ImageModule from '../Modules/ImageModule.vue';
  import TextModule from '../Modules/TextModule.vue';
  
  // Registry to resolve components by name
  const componentRegistry = {
	'ImageModule': markRaw(ImageModule),
	'TextModule': markRaw(TextModule)
  };
  
  // Define the modules array
  const modules = ref([]);
  
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
  
		const resolvedComponent = componentRegistry[moduleData.componentName];
		if (!resolvedComponent) {
		  console.error('Component not found in registry:', moduleData.componentName);
		  return;
		}
  
		moduleData.component = resolvedComponent;
  
		const canvasRect = event.target.getBoundingClientRect();
		const x = event.pageX - canvasRect.left;
		const y = event.pageY - canvasRect.top;
  
		moduleData.props.x = x;
		moduleData.props.y = y;
		moduleData.props.width = moduleData.props.width || 100; // Default width
		moduleData.props.height = moduleData.props.height || 100; // Default height
  
		modules.value.push(moduleData);
	  } catch (error) {
		console.error('Error parsing dropped data:', error);
	  }
	}
  };
  
  // Filter out x and y from props before passing to component
  const getFilteredProps = (props) => {
	const { x, y, ...rest } = props;
	return rest;
  };
  
  // Function to handle updating module data
  const updateModuleData = (id, newData) => {
	const module = modules.value.find((m) => m.id === id);
	if (module) {
	  module.props.data = newData;
	}
  };
  
  // Resizing functionality
  let resizingModule = null;
  let initialMousePosition = { x: 0, y: 0 };
  
  const startResize = (event, module) => {
	resizingModule = module;
	initialMousePosition = { x: event.pageX, y: event.pageY };
  
	window.addEventListener('mousemove', resizeModule);
	window.addEventListener('mouseup', stopResize);
  };
  
  const resizeModule = (event) => {
	if (resizingModule) {
	  const deltaX = event.pageX - initialMousePosition.x;
	  const deltaY = event.pageY - initialMousePosition.y;
  
	  resizingModule.props.width += deltaX;
	  resizingModule.props.height += deltaY;
  
	  initialMousePosition = { x: event.pageX, y: event.pageY };
	}
  };
  
  const stopResize = () => {
	window.removeEventListener('mousemove', resizeModule);
	window.removeEventListener('mouseup', stopResize);
	resizingModule = null;
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
  