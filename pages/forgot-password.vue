<script setup lang="ts">
import type { forgotPasswordStageType } from "~/lib/utils.type";
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
  title: "Forgot Password - Nebulaform",
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
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    console.log(values);
  } catch (err: any) {
    toast({
      variant: "destructive",
      description: err.message,
    });
  } finally {
    isLoading.value = false;
  }
});

const stage = ref<forgotPasswordStageType>("stageIsOnRequestForm");
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex justify-center items-center flex-col gap-4 p-4">
      <div class="flex flex-col justify-center items-center gap-4">
        <NuxtLink to="/"><NuxtImg src="/brand/logodark.svg" width="40"></NuxtImg></NuxtLink>
        <h1 class="font-bold text-2xl">Forgot password</h1>
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
          <Button class="w-full" type="submit">
            <div class="flex justify-center items-center" v-if="isLoading">
              <Loader2 class="animate-spin mr-2 w-4 h-4" />Sending email
            </div>
            <div v-else>Send email</div></Button
          >
          <div class="flex flex-col gap-2 mt-4">
            <span class="text-sm"
              >Back to <NuxtLink to="/login" class="text-primary hover:underline">Login</NuxtLink></span
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
