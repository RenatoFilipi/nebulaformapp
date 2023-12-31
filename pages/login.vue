<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Loader2 } from "lucide-vue-next";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toast } = useToast();

useHead({
  title: "Login - Nebulaform",
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

const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "must be at least 6 characters." }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      throw new Error(error.message);
    }
    return navigateTo("/confirm");
  } catch (err: any) {
    toast({
      variant: "destructive",
      description: err.message,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex justify-center items-center flex-col gap-4 p-4">
      <div class="flex flex-col justify-center items-center gap-4">
        <NuxtLink to="/"><NuxtImg src="/images/brand/logodark.svg" width="40"></NuxtImg></NuxtLink>
        <h1 class="font-bold text-2xl">Sign in to your account</h1>
      </div>
      <div class="flex flex-col justify-center items-center p-6 w-[400px]">
        <form @submit="onSubmit" class="flex flex-col gap-4 w-full">
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button class="w-full" type="submit" :disabled="isLoading">
            <div class="flex justify-center items-center" v-if="isLoading">
              <Loader2 class="animate-spin mr-2 w-4 h-4" />Logging in
            </div>
            <div v-else>Continue</div></Button
          >
          <div class="flex flex-col gap-2 mt-4">
            <span class="text-sm"
              >Don't have an account?
              <NuxtLink to="/signup" class="text-primary hover:underline">Sign up</NuxtLink></span
            >
            <span class="text-sm"
              >Forgot your password?
              <NuxtLink to="/forgot-password" class="text-primary hover:underline">Reset password</NuxtLink></span
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
