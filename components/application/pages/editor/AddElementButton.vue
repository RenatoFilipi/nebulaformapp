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
import { editorElementOptions, editorElementOptionsEnum } from "~/lib/utils.config";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { RadioGroup } from "~/components/ui/radio-group";
import { CheckSquare2, Text, Star, Plus } from "lucide-vue-next";
import { newUuid } from "~/lib/utils";
import { useEditorStore } from "~/stores/editor";
import type { multipleChoiceProps, openEndedProps, likertScaleProps, elementProps } from "~/lib/utils.interfaces";

const editorStore = useEditorStore();
const openDialog = ref(false);

const formSchema = toTypedSchema(
  z.object({
    type: z.enum(editorElementOptionsEnum, {
      required_error: "you need to select a element type.",
    }),
  })
);

const form = useForm({
  validationSchema: formSchema,
});

const onSubmit = form.handleSubmit((values) => {
  switch (values.type) {
    case "multipleChoice":
      {
        const templateElementProps: multipleChoiceProps = {
          question: "Multiple Choice Element",
          description: "",
          options: [
            { label: "Option Label", value: newUuid() },
            { label: "Option Label", value: newUuid() },
          ],
        };

        const templateElement: elementProps = {
          id: newUuid(),
          type: "multipleChoice",
          props: templateElementProps,
        };
        editorStore.addElement(templateElement);
      }
      break;
    case "openEnded":
      {
        const templateElementProps: openEndedProps = {
          question: "Open Ended Element",
          description: "",
        };

        const templateElement: elementProps = {
          id: newUuid(),
          type: "openEnded",
          props: templateElementProps,
        };
        editorStore.addElement(templateElement);
      }
      break;
    case "likertScale":
      {
        const templateElementProps: likertScaleProps = {
          question: "Likert Scale Element",
          description: "",
          lowestLabel: "",
          highestLabel: "",
        };

        const templateElement: elementProps = {
          id: newUuid(),
          type: "likertScale",
          props: templateElementProps,
        };
        editorStore.addElement(templateElement);
      }
      break;
  }
  openDialog.value = false;
});
</script>

<template>
  <Dialog v-model:open="openDialog">
    <DialogTrigger as-child>
      <Button variant="outline"><Plus class="mr-2 w-4 h-4" />Add Element</Button>
    </DialogTrigger>
    <DialogContent>
      <form @submit="onSubmit">
        <DialogHeader class="mb-4">
          <DialogTitle>Elements</DialogTitle>
          <DialogDescription> Select a element to add to form.</DialogDescription>
        </DialogHeader>
        <FormField v-slot="{ componentField }" name="type" type="radio">
          <FormItem>
            <FormControl>
              <RadioGroup class="flex flex-col gap-4 overflow-auto mb-4" v-bind:="componentField"
                ><FormItem v-for="(option, index) in editorElementOptions" :key="index" class=""
                  ><FormControl>
                    <div class="">
                      <RadioGroupItem :value="option.type" :id="option.type" class="peer sr-only" /><Label
                        :for="option.type"
                        class="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent cursor-pointer hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        ><div class="flex items-center gap-3">
                          <div>
                            <CheckSquare2 v-if="option.type === 'multipleChoice'" class="text-primary" />
                            <Text v-if="option.type === 'openEnded'" class="text-primary" />
                            <Star v-if="option.type === 'likertScale'" class="text-primary" />
                          </div>
                          <div class="flex flex-col gap-1">
                            <span class="font-medium">{{ option.title }}</span>
                            <p class="text-zinc-500 font-normal text-sm text-start">{{ option.description }}</p>
                          </div>
                        </div></Label
                      >
                    </div>
                  </FormControl></FormItem
                ></RadioGroup
              >
            </FormControl>
          </FormItem>
        </FormField>
        <DialogFooter><Button type="submit">Add Element</Button></DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
