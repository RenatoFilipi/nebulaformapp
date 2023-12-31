<script setup lang="ts">
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { elementProps, multipleChoiceProps } from "~/lib/utils.interfaces";
import { Trash } from "lucide-vue-next";
import { useEditorStore } from "~/stores/editor";
import { newUuid } from "~/lib/utils";

const editorStore = useEditorStore();
const element = defineProps<{
  id: elementProps["id"];
  type: elementProps["type"];
  props: multipleChoiceProps;
}>();

const handleDeleteOption = (optionValue: string) => {
  element.props.options = element.props.options.filter((el) => el.value !== optionValue);
};

const handleAddOption = () => {
  element.props.options.push({ value: newUuid(), label: "" });
};
</script>

<template>
  <Card :key="element.id" class="p-4 hover:border-primary"
    ><div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <div class="flex justify-center items-center gap-4">
          <Label>Question</Label>
          <Input v-model="element.props.question" />
        </div>
        <div class="flex justify-center items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button variant="outline"><Trash class="mr-2 w-4 h-4" />Delete Element</Button></AlertDialogTrigger
            >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this element of the form and all
                  information related to it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction as-child
                  ><Button @click="editorStore.removeElement(element.id)">Delete</Button></AlertDialogAction
                >
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div class="flex justify-center items-center gap-4">
        <Label>Description</Label>
        <Input v-model="element.props.description" />
      </div>
      <div class="flex flex-col gap-4">
        <div>
          <div
            v-for="(option, index) in element.props.options"
            :key="index"
            class="flex justify-between items-center py-2">
            <div class="flex items-center gap-4">
              <Label :for="option.value">#{{ index + 1 }}</Label>
              <Input :id="option.value" v-model="option.label" />
            </div>
            <div>
              <Button
                variant="secondary"
                @click="handleDeleteOption(option.value)"
                :disabled="element.props.options.length <= 2"
                ><Trash class="w-4 h-4"
              /></Button>
            </div>
          </div>
        </div>
        <Button @click="handleAddOption" variant="secondary">Add Option</Button>
      </div>
    </div>
  </Card>
</template>
