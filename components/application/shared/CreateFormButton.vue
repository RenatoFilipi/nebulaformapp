<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Loader2, Plus } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import type { Database } from "~/lib/database.types";
import { Textarea } from "@/components/ui/textarea";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const { toast } = useToast();

const isLoading = ref(false);

const formSchema = toTypedSchema(
  z.object({
    title: z.string().min(3, { message: "must be at least 6 characters." }),
    description: z.string().optional(),
  })
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    description: "",
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  try {
    console.log(values);
    isLoading.value = true;
    const { data, error, status } = await supabase
      .from("forms")
      .insert([{ title: values.title, owner_id: user.value?.id as string, description: values.description }])
      .select()
      .single();

    if (error) throw new Error();
    navigateTo("/dashboard/form/" + data.id);
  } catch (err: any) {
    toast({
      variant: "destructive",
      description: "Error on creating new Form, please try again.",
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
          <DialogDescription class="py-4 flex flex-col gap-4">
            <FormField v-slot="{ componentField }" name="title">
              <FormItem>
                <FormControl>
                  <Input type="text" placeholder="Name" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="description">
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Description (optional)" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose as-child><Button type="button" variant="outline">Cancel</Button></DialogClose>
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
