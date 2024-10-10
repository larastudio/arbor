<template>
  <img :src="src" :style="{ top: `${y}px`, left: `${x}px`, position: 'absolute' }" />
</template>

<script setup>
defineProps({
  src: String,
  x: Number,
  y: Number
});
</script>

<style scoped>
img {
  position: absolute;
}
</style>
