<script setup lang="ts">
const user = useSupabaseUser();

useHead({
  title: "Email confirmation - Nebulaform",
});

definePageMeta({
  layout: "default",
});

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/dashboard");
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex justify-center items-center flex-col gap-4 p-4">
      <div class="flex flex-col justify-center items-center gap-4">
        <NuxtLink to="/"><NuxtImg src="/brand/logodark.svg" width="40"></NuxtImg></NuxtLink>
        <h1 class="font-bold text-2xl">Email Confirmation</h1>
      </div>
      <div class="flex flex-col justify-center items-center p-6 w-[400px]">
        <div class="flex flex-col pb-6 justify-center items-center gap-3">
          <span class="text-lg">Email verified</span>
          <Button as-child class="w-full">
            <NuxtLink to="/login">Log in your account</NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
