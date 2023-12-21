<script setup lang="ts">
import type { Database } from "~/lib/database.types";
const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

useHead({
  title: "Dashboard - Nebulaform",
});

definePageMeta({
  layout: "application",
});

const { data: forms } = await useAsyncData("forms", async () => {
  const { data } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", user.value?.id as string);
  return data;
});

console.log(forms.value);
</script>

<template>
  <div>
    <div class="flex justify-center items-center h-screen">
      <div class="flex flex-col items-center justify-center gap-6">
        <span>Logged page</span>
      </div>
    </div>
  </div>
</template>
