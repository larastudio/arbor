<template>
    <div class="module" :style="computedStyle" @mousedown="startMove">
      <component :is="module.component" v-bind="filteredProps" @update:data="updateModuleData" />
      <div class="resize-handle" @mousedown="startResize"></div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, toRefs } from 'vue';
  
  const props = defineProps({
    module: Object,
    canvasWidth: Number,
    canvasHeight: Number
  });
  
  const emit = defineEmits(['update:data']);
  
  const { module, canvasWidth, canvasHeight } = toRefs(props);
  
  const computedStyle = computed(() => ({
    top: `${module.value.props.y}px`,
    left: `${module.value.props.x}px`,
    width: `${module.value.props.width}px`,
    height: `${module.value.props.height}px`,
    position: 'absolute',
    border: '1px solid red',
    overflow: 'hidden'
  }));
  
  const filteredProps = computed(() => {
    const { x, y, width, height, ...rest } = module.value.props;
    return rest;
  });
  
  let movingModule = ref(null);
  let initialMousePosition = ref({ x: 0, y: 0 });
  
  const startMove = (event) => {
    movingModule.value = module.value;
    initialMousePosition.value = { x: event.pageX, y: event.pageY };
  
    window.addEventListener('mousemove', moveModule);
    window.addEventListener('mouseup', stopMove);
  };
  
  const moveModule = (event) => {
    if (movingModule.value) {
      const deltaX = event.pageX - initialMousePosition.value.x;
      const deltaY = event.pageY - initialMousePosition.value.y;
  
      let newX = movingModule.value.props.x + deltaX;
      let newY = movingModule.value.props.y + deltaY;
  
      // Constrain within canvas boundaries
      newX = Math.max(0, Math.min(newX, canvasWidth.value - movingModule.value.props.width));
      newY = Math.max(0, Math.min(newY, canvasHeight.value - movingModule.value.props.height));
  
      movingModule.value.props.x = newX;
      movingModule.value.props.y = newY;
  
      initialMousePosition.value = { x: event.pageX, y: event.pageY };
    }
  };
  
  const stopMove = () => {
    window.removeEventListener('mousemove', moveModule);
    window.removeEventListener('mouseup', stopMove);
    movingModule.value = null;
  };
  
  let resizingModule = ref(null);
  let initialResizePosition = ref({ x: 0, y: 0 });
  let originalDimensions = ref({ width: 0, height: 0 });
  
  const startResize = (event) => {
    event.stopPropagation();
    resizingModule.value = module.value;
    initialResizePosition.value = { x: event.pageX, y: event.pageY };
    originalDimensions.value = {
      width: resizingModule.value.props.width,
      height: resizingModule.value.props.height
    };
  
    window.addEventListener('mousemove', resizeModule);
    window.addEventListener('mouseup', stopResize);
  };
  
  const resizeModule = (event) => {
    if (resizingModule.value) {
      const deltaX = event.pageX - initialResizePosition.value.x;
      const deltaY = event.pageY - initialResizePosition.value.y;
  
      let newWidth = originalDimensions.value.width + deltaX;
      let newHeight = originalDimensions.value.height + deltaY;
  
      // Prevent negative width or height
      newWidth = Math.max(10, newWidth);
      newHeight = Math.max(10, newHeight);
  
      // Constrain within canvas boundaries
      newWidth = Math.min(newWidth, canvasWidth.value - resizingModule.value.props.x);
      newHeight = Math.min(newHeight, canvasHeight.value - resizingModule.value.props.y);
  
      resizingModule.value.props.width = newWidth;
      resizingModule.value.props.height = newHeight;
    }
  };
  
  const stopResize = () => {
    window.removeEventListener('mousemove', resizeModule);
    window.removeEventListener('mouseup', stopResize);
    resizingModule.value = null;
  };
  
  // Emit the updated module data to the parent
  const updateModuleData = (newData) => {
    module.value.props.data = newData;
    emit('update:data', newData);
  };
  </script>
  
  <style scoped>
  .module {
    position: absolute;
    border: 1px solid red;
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
  