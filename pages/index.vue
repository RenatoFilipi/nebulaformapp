<script setup lang="ts">
import { Rocket } from "lucide-vue-next";
const user = useSupabaseUser();

useHead({
  title: "Nebulaform",
});

definePageMeta({
  layout: "default",
});
</script>

<template>
  <div class="">
    <nav class="fixed w-screen flex justify-between items-center px-10 py-5 bg-white">
      <NuxtLink to="/" class="flex justify-center items-center"
        ><NuxtImg src="/images/brand/logotextdark.svg" width="200"
      /></NuxtLink>
      <div v-if="user" class="flex justify-center items-center">
        <Button variant="default" as-child><NuxtLink to="/confirm">Dashboard</NuxtLink></Button>
      </div>
      <div v-else class="flex justify-center items-center gap-6">
        <Button as-child variant="outline">
          <NuxtLink to="/login">Log in</NuxtLink>
        </Button>
        <Button as-child variant="default">
          <NuxtLink to="/signup"><Rocket class="mr-2 h-4 w-4" />Get started for free</NuxtLink>
        </Button>
      </div>
    </nav>
    <div class="flex justify-center items-center h-screen">
      <div class="flex flex-col justify-center items-center">
        <h1
          class="text-5xl font-extrabold mb-5 bg-gradient-to-r from-neutral-800 via-primary to-neutral-800 inline-block text-transparent bg-clip-text">
          Empower Your Business with Insightful Forms
        </h1>
        <h2 class="text-xl font-medium text-neutral-500 mb-10 text-center">
          Empower Your Business to Make Informed and Strategic Data-Driven Decisions.
        </h2>
        <Button asChild variant="default">
          <NuxtLink v-if="user" to="/confirm"> <Rocket class="mr-2 h-4 w-4" /> Get Started for free </NuxtLink>
          <NuxtLink v-else to="/signup">
            <Rocket class="mr-2 h-4 w-4" />
            Get Started for free
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>
