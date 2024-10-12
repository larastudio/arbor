<template>
	<div class="canvas" @dragenter="blockEvent" @dragover="blockEvent" @drop="onDrop">
		<div v-for="module in modules" :key="module.id" class="module" :style="{
			top: `${module.props.y}px`,
			left: `${module.props.x}px`,
			width: `${module.props.width}px`,
			height: `${module.props.height}px`,
			position: 'absolute',
			border: '1px solid red',
			overflow: 'hidden'
		}" @mousedown="startMove($event, module)">
			<component :is="module.component" v-bind="getFilteredProps(module.props)"
				@update:data="updateModuleData(module.id, $event)" />

			<div class="resize-handle" @mousedown="startResize($event, module)"></div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { modules, addModule, getFilteredProps, startResize, updateModuleData } from '../classes/Module';

// Store for tracking movement state
let movingModule = null;
let initialMousePosition = { x: 0, y: 0 };

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

// Function to start moving the module
const startMove = (event, module) => {
	movingModule = module;
	initialMousePosition = { x: event.pageX, y: event.pageY };

	window.addEventListener('mousemove', moveModule);
	window.addEventListener('mouseup', stopMove);
};

// Function to move the module based on mouse movement
const moveModule = (event) => {
	if (movingModule) {
		const deltaX = event.pageX - initialMousePosition.x;
		const deltaY = event.pageY - initialMousePosition.y;

		movingModule.props.x += deltaX;
		movingModule.props.y += deltaY;

		initialMousePosition = { x: event.pageX, y: event.pageY };
	}
};

// Function to stop moving the module
const stopMove = () => {
	window.removeEventListener('mousemove', moveModule);
	window.removeEventListener('mouseup', stopMove);
	movingModule = null;
};

// Cleanup event listeners when component is unmounted
onBeforeUnmount(() => {
	window.removeEventListener('mousemove', moveModule);
	window.removeEventListener('mouseup', stopMove);
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