<script setup lang="ts">
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { toast } = useToast();

useHead({
  title: "Login - Nebulaform",
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

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(6, { message: "must be at least 6 characters." }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

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

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) throw new Error(error.message);
    return navigateTo("/confirm");
  } catch (err: any) {
    toast({
      variant: "destructive",
      description: err.message,
    });
  }
});
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex flex-col justify-center items-center border rounded p-6 w-[400px]">
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
        <Button class="w-full" type="submit">Continue</Button>
      </form>
    </div>
  </div>
</template>
