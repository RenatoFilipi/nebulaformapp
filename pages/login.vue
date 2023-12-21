<script setup lang="ts">
import { Button } from "~/components/ui/button";
const supabase = useSupabaseClient();
const user = useSupabaseUser();

watch(
  user,
  () => {
    if (user.value) {
      return navigateTo("/dashboard");
    }
  },
  { immediate: true }
);

const onLogin = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: "re.rosa98@gmail.com",
    password: "Supatest@123",
  });
  if (error) {
    console.log(error);
    return;
  }
  return navigateTo("/confirm");
};
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex flex-col justify-center items-center gap-10">
      <Button @Click="onLogin">Continue</Button>
    </div>
  </div>
</template>
