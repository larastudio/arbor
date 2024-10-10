<template>
  <img :src="src" alt="module-image" class="image-module" />
</template>

<script setup>
defineProps({
  src: String
});
</script>

<style scoped>
.image-module {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image fills the space while maintaining its aspect ratio */
}
</style>
