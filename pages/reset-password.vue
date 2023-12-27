<script setup lang="ts">
import type { updatePasswordStageType } from "~/lib/utils.types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Loader2 } from "lucide-vue-next";

const supabase = useSupabaseClient();
const { toast } = useToast();

useHead({
  title: "Reset Password - Nebulaform",
});

definePageMeta({
  layout: "default",
});

const stage = ref<updatePasswordStageType>("stageIsOnUpdateForm");
const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    password: z.string().min(6, { message: "must be at least 6 characters." }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    const { error } = await supabase.auth.updateUser({ password: values.password });
    if (error) throw new Error(error.message);
    stage.value = "stageIsUpdated";
    toast({
      description: "password update succefully",
    });
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
        <h1 class="font-bold text-2xl">Reset password</h1>
      </div>
      <div class="flex flex-col justify-center items-center p-6 min-w-[400px]">
        <form @submit="onSubmit" v-if="stage === 'stageIsOnUpdateForm'" class="flex flex-col gap-4 w-full">
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
              <Loader2 class="animate-spin mr-2 w-4 h-4" />Updating
            </div>
            <div v-else>Update</div></Button
          >
          <div class="flex flex-col gap-2 mt-4">
            <span class="text-sm"
              >Back to <NuxtLink to="/login" class="text-primary hover:underline">Login</NuxtLink></span
            >
          </div>
        </form>
        <div v-if="stage === 'stageIsUpdated'" class="flex flex-col justify-center items-center gap-4 w-full">
          <span class="font-bold text-lg">Password updated</span>
          <Button as-child>
            <NuxtLink to="/login">Log into your account</NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
