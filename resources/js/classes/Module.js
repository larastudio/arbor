import axios from 'axios';
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

// Ensure components are registered before any module can be added
const modulesRegistered = registerModules();

// Store for module state
export const modules = ref([]);

// Save modules to the backend
export const saveModules = async () => {
    try {
        // Log the modules before sending
        console.log('Modules to save:', modules.value);

        const response = await axios.post('/save-modules', { modules: modules.value });

        if (response.status === 200) {
            console.log('Modules saved successfully');
        } else {
            console.error('Failed to save modules');
        }
    } catch (error) {
        console.error('Error saving modules:', error);
    }
};


// Function to generate a unique ID using Date.now() and a random component
const generateUniqueId = () => {
  return `module-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

// Function to add a new module to the canvas
export const addModule = async (moduleData, canvasRect, event) => {
  // Ensure that modules are fully registered before adding new ones
  await modulesRegistered;

  // Resolve the component from the registry using the component name
  const resolvedComponent = componentRegistry[moduleData.componentName];

  if (!resolvedComponent) {
    console.error('Component not found in registry:', moduleData.componentName);
    return;
  }

  // Generate a unique ID for each module when dropped onto the canvas
  const uniqueId = generateUniqueId();
  moduleData = { ...moduleData, id: uniqueId }; // Ensure a new object is created with a unique ID

  // Log the newly generated unique ID
  console.log('New Module ID:', uniqueId);

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
