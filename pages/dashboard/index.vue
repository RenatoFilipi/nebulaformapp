<script setup lang="ts">
import { Button } from "~/components/ui/button";
const supabase = useSupabaseClient();

useHead({
  title: "Dashboard - Nebulaform",
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
  <div class="flex justify-center items-center h-screen">
    <div class="flex flex-col items-center justify-center gap-6">
      <span>Logged page</span>
      <Button @click="onLogout">Log out</Button>
    </div>
  </div>
</template>
