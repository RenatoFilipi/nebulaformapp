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
const editorStore = useEditorStore();

const element = defineProps<{
  id: elementProps["id"];
  type: elementProps["type"];
  props: multipleChoiceProps;
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const inputText = target.value;

  console.log(inputText);

  const updatedElement: elementProps = {
    id: element.id,
    type: element.type,
    props: element.props,
  };
};
</script>

<template>
  <Card :key="element.id" class="p-4"
    ><div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <span>{{ element.props.question }}</span>
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
      <div class="">
        <div
          v-for="(option, index) in element.props.options"
          :key="index"
          class="flex justify-between items-center py-2">
          <div class="flex items-center gap-4">
            <Input v-model.trim="option.label" />
          </div>
          <div>
            <Button variant="outline"><Trash class="mr-2 w-4 h-4" />Delete option</Button>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>
