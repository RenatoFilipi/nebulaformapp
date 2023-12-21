<script setup lang="ts">
import { Button } from "~/components/ui/button";
import type { Database } from "~/lib/database.types";
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

useHead({
  title: "Dashboard - Nebulaform",
});

const { data: forms } = await useAsyncData("forms", async () => {
  const { data } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", user.value?.id as string);
  return data;
});

console.log(forms.value);

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
