import { ref, markRaw } from 'vue';

// Dynamically import all Vue components from the Modules directory using Vite's import.meta.glob
const modulesContext = import.meta.glob('../Modules/*.vue');

// Component registry
const componentRegistry = {};

// Function to register components dynamically
const registerModules = async () => {
  for (const path in modulesContext) {
    const module = await modulesContext[path]();
    const componentName = path.split('/').pop().replace('.vue', '');
    componentRegistry[componentName] = markRaw(module.default || module);
  }
};

// Call the register function to load components
registerModules();

// Store for module state
export const modules = ref([]);

// Function to add a new module to the canvas
export const addModule = (moduleData, canvasRect, event) => {
  // Resolve the component from the registry using the component name
  const resolvedComponent = componentRegistry[moduleData.componentName];

  if (!resolvedComponent) {
    console.error('Component not found in registry:', moduleData.componentName);
    return;
  }

  // Compute drop position
  const x = event.pageX - canvasRect.left;
  const y = event.pageY - canvasRect.top;

  // Set default dimensions if not provided
  moduleData.props.x = x;
  moduleData.props.y = y;
  moduleData.props.width = moduleData.props.width || 100; // Default width
  moduleData.props.height = moduleData.props.height || 100; // Default height

  // Assign the resolved component
  moduleData.component = resolvedComponent;

  // Add module to array
  modules.value.push(moduleData);
};

// Filter out x and y from props before passing to the component
export const getFilteredProps = (props) => {
  const { x, y, ...rest } = props;
  return rest;
};

// Resize functionality
let resizingModule = null;
let initialMousePosition = { x: 0, y: 0 };

export const startResize = (event, module) => {
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

// Function to update module data
export const updateModuleData = (id, newData) => {
  const module = modules.value.find((m) => m.id === id);
  if (module) {
    module.props.data = newData;
  }
};
