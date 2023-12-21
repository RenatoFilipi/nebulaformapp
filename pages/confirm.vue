<script setup lang="ts">
const user = useSupabaseUser();

definePageMeta({
  layout: "default",
});

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/dashboard");
    } else {
      return navigateTo("/login");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div></div>
</template>
