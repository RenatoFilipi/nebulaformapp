<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { Loader2 } from "lucide-vue-next";
import type { signupStageType } from "~/lib/utils.type";
import { mailMasker } from "~/lib/utils";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toast } = useToast();

useHead({
  title: "Signup - Nbulaform",
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

const stage = ref<signupStageType>("stageSignUpForm");
const isLoading = ref(false);
const email = ref("");

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
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: "http://localhost:3000/email-confirmation",
      },
    });
    if (error) throw new Error(error.message);
    email.value = values.email;
    stage.value = "stageVerifyEmail";
    toast({
      description: "Signup successfully",
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

const onResendEmail = async () => {
  try {
    isLoading.value = true;
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.value,
      options: {
        emailRedirectTo: "http://localhost:3000/email-confirmation",
      },
    });
    if (error) throw new Error(error.message);
    toast({
      description: "Resend email confirmed, please verify your email",
    });
  } catch (err: any) {
    toast({
      variant: "destructive",
      description: err.message,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex justify-center items-center flex-col gap-4 p-4">
      <div class="flex flex-col justify-center items-center gap-4">
        <NuxtLink to="/"><NuxtImg src="/images/brand/logodark.svg" width="40"></NuxtImg></NuxtLink>
        <h1 class="font-bold text-2xl">Create your account</h1>
      </div>
      <div class="flex flex-col justify-center items-center p-6 min-w-[400px]">
        <form v-if="stage === 'stageSignUpForm'" @submit="onSubmit" class="flex flex-col gap-4 w-full">
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
          <Button class="w-full" type="submit">
            <div class="flex justify-center items-center" v-if="isLoading">
              <Loader2 class="animate-spin mr-2 w-4 h-4" />Creating Account
            </div>
            <div v-else>Create Account</div></Button
          >
          <div class="flex flex-col gap-2 mt-4">
            <span class="text-sm"
              >Already have an account?
              <NuxtLink to="/login" class="text-primary hover:underline">Log in</NuxtLink></span
            >
          </div>
        </form>
        <div v-if="stage === 'stageVerifyEmail'" class="flex flex-col pb-6 justify-center items-center gap-3">
          <span class="font-bold text-lg">Verify your Email</span>
          <div class="flex flex-col justify-center items-center">
            <span class="text-sm">We have sent a verification email to {{ mailMasker(email) }}.</span>
            <span class="text-sm">Click the link in the email to verify your account.</span>
          </div>
          <div class="flex w-full mt-4">
            <Button class="w-full" type="button" @click="onResendEmail">
              <div class="flex justify-center items-center" v-if="isLoading">
                <Loader2 class="animate-spin mr-2 w-4 h-4" />Resending Email
              </div>
              <div v-else>Resend Email</div></Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
