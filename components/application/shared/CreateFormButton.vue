<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Loader2, Plus } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import type { Database } from "~/lib/database.types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const { toast } = useToast();

const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(3, { message: "must be at least 6 characters." }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true;
    const { data, error } = await supabase
      .from("forms")
      .insert([{ title: values.title, owner_id: user.value?.id }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    toast({
      description: "Form created",
    });
    navigateTo("/dashboard/form/" + data.id);
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
  <Dialog>
    <DialogTrigger as-child
      ><Button><Plus class="mr-2 w-4 h-4" />Create Form</Button></DialogTrigger
    >
    <DialogContent>
      <form @submit="onSubmit">
        <DialogHeader>
          <DialogTitle>Create Form</DialogTitle>
          <DialogDescription class="py-4">
            <FormField v-slot="{ componentField }" name="title">
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" :disabled="isLoading">
            <div class="flex justify-center items-center" v-if="isLoading">
              <Loader2 class="animate-spin mr-2 h-4 w-4" />Creating
            </div>
            <div v-else>Create</div>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
