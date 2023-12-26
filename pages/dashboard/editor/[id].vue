<script setup lang="ts">
import Elements from "~/components/application/pages/editor/Elements.vue";
import Preview from "~/components/application/pages/editor/Preview.vue";

useHead({
  title: "Editor - Nebulaform",
});

definePageMeta({
  layout: "application",
});
</script>

<template>
  <div class="flex justify-center items-center h-screen"><Elements /><Preview /></div>
</template>
