<script setup lang="ts">
const user = useSupabaseUser();

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
