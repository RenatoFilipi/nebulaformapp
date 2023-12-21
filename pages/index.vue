<script setup lang="ts">
import { Rocket } from "lucide-vue-next";
const user = useSupabaseUser();

useHead({
  title: "Nebulaform",
});
</script>

<template>
  <div class="">
    <nav class="fixed w-screen flex justify-between items-center px-10 py-5 bg-white">
      <NuxtLink to="/" class="flex justify-center items-center"><NuxtImg src="/brand/logotextdark.svg" /></NuxtLink>
      <div v-if="user" class="flex justify-center items-center">
        <Button as-child><NuxtLink to="/confirm">Dashboard</NuxtLink></Button>
      </div>
      <div v-else class="flex justify-center items-center gap-6">
        <Button as-child variant="outline">
          <NuxtLink to="/login">Log in</NuxtLink>
        </Button>
        <Button as-child variant="default">
          <NuxtLink to="/login"><Rocket class="mr-2 h-4 w-4" />Get started for free</NuxtLink>
        </Button>
      </div>
    </nav>
    <div class="flex justify-center items-center h-screen">
      <div class="flex flex-col justify-center items-center">
        <h1 class="text-5xl font-extrabold mb-2">Empower Your Business with Insightful Forms</h1>
        <h2 class="text-lg font-medium text-neutral-500 mb-10">Make Data-Driven Decisions with Confidence.</h2>
        <Button asChild variant="default">
          <NuxtLink v-if="user" to="/confirm">Dashboard</NuxtLink>
          <NuxtLink v-else to="/login">
            <Rocket class="mr-2 h-4 w-4" />
            Get Started for free
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>
