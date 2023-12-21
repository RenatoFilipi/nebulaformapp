<script setup lang="ts">
import type { Database } from "~/lib/database.types";
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
        <div class="flex justify-center items-center gap-16">
          <NuxtLink to="/dashboard">
            <NuxtImg src="/brand/logodark.svg" width="35" />
          </NuxtLink>
        </div>
        <div class="flex justify-center items-center gap-4">
          <Button @click="onLogout">Log out</Button>
        </div>
      </div>
    </header>
  </div>
</template>
