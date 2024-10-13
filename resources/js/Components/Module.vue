<template>
    <div class="module-wrapper" :style="computedWrapperStyle">
      <!-- Drag handle attached to the top-left but outside of the module -->
      <div class="drag-handle" @mousedown="startMove"></div>
      <div class="module" :style="computedStyle">
        <component :is="module.component" v-bind="filteredProps" @update:data="updateModuleData" />
        <div class="resize-handle" @mousedown="startResize"></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, toRefs, onBeforeUnmount } from 'vue';
  
  const props = defineProps({
    module: Object,
    canvasWidth: Number,
    canvasHeight: Number
  });
  
  const emit = defineEmits(['update:data']);
  
  const { module, canvasWidth, canvasHeight } = toRefs(props);
  
  const computedWrapperStyle = computed(() => ({
    top: `${module.value.props.y}px`,
    left: `${module.value.props.x}px`,
    position: 'absolute'
  }));
  
  const computedStyle = computed(() => ({
    width: `${module.value.props.width}px`,
    height: `${module.value.props.height}px`,
    border: '1px solid red',
    overflow: 'hidden'
  }));
  
  const filteredProps = computed(() => {
    const { x, y, width, height, ...rest } = module.value.props;
    return rest;
  });
  
  // State to track if the module is moving or resizing
  let movingModule = ref(null);
  let initialMousePosition = ref({ x: 0, y: 0 });
  let isMoving = false;
  
  let resizingModule = ref(null);
  let initialResizePosition = ref({ x: 0, y: 0 });
  let originalDimensions = ref({ width: 0, height: 0 });
  let isResizing = false;
  
  const startMove = (event) => {
    event.stopPropagation(); // Prevent any other elements from also triggering drag events
    movingModule.value = module.value;
    initialMousePosition.value = { x: event.pageX, y: event.pageY };
    isMoving = true;
  
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
    if (isMoving) {
      window.removeEventListener('mousemove', moveModule);
      window.removeEventListener('mouseup', stopMove);
      isMoving = false;
    }
    movingModule.value = null;
  };
  
  const startResize = (event) => {
    event.stopPropagation();
    resizingModule.value = module.value;
    initialResizePosition.value = { x: event.pageX, y: event.pageY };
    originalDimensions.value = {
      width: resizingModule.value.props.width,
      height: resizingModule.value.props.height
    };
    isResizing = true;
  
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
    if (isResizing) {
      window.removeEventListener('mousemove', resizeModule);
      window.removeEventListener('mouseup', stopResize);
      isResizing = false;
    }
    resizingModule.value = null;
  };
  
  // Cleanup event listeners when component is unmounted
  onBeforeUnmount(() => {
    if (isMoving) {
      window.removeEventListener('mousemove', moveModule);
      window.removeEventListener('mouseup', stopMove);
    }
    if (isResizing) {
      window.removeEventListener('mousemove', resizeModule);
      window.removeEventListener('mouseup', stopResize);
    }
  });
  
  // Emit the updated module data to the parent
  const updateModuleData = (newData) => {
    module.value.props.data = newData;
    emit('update:data', newData);
  };
  </script>
  
  <style scoped>
  .module-wrapper {
    position: absolute;
  }
  
  .drag-handle {
    width: 20px;
    height: 15px;
    background-color: gray;
    position: absolute;
    top: -15px; /* Position the handle slightly outside the module */
    left: 0;
    cursor: move;
  }
  
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
  