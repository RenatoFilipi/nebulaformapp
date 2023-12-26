<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import { LogOut } from "lucide-vue-next";

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const avatarUser = computed(() => {
  const email = user.value?.email as string;
  return email.slice(0, 2).toUpperCase();
});

const onLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    return;
  }
  return navigateTo("/login");
};
</script>

<template>
  <div>
    <header class="flex flex-col border-b bg-white fixed w-screen z-10">
      <div class="flex justify-between items-center w-full px-6 h-16">
        <div class="flex justify-center items-center gap-12">
          <NuxtLink to="/dashboard">
            <NuxtImg src="/images/brand/logodark.svg" width="35" />
          </NuxtLink>
          <nav class="flex justify-center items-center gap-6">
            <NuxtLink to="/dashboard" class="text-zinc-500 hover:text-black">Dashboard</NuxtLink>
          </nav>
        </div>
        <div class="flex justify-center items-center gap-4">
          <Button variant="outline" size="sm" @click="onLogout"><LogOut class="mr-2 w-4 h-4" />Log out</Button>
        </div>
      </div>
    </header>
  </div>
</template>
