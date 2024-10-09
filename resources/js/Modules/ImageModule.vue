<template>
  <img :src="src" alt="Image Module" />
</template>

<script setup>
defineProps({
  src: String
});
</script>

<style scoped>
img {
  width: 100%;
  height: auto;
}
</style>
