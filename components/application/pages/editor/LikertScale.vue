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
import type { elementProps, likertScaleProps } from "~/lib/utils.interfaces";
import { Trash } from "lucide-vue-next";
import { useEditorStore } from "~/stores/editor";

const editorStore = useEditorStore();
const element = defineProps<{
  id: elementProps["id"];
  type: elementProps["type"];
  props: likertScaleProps;
}>();
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
        <div class="flex items-center">
          <Label>Lowest Label</Label>
          <Input v-model="element.props.lowestLabel" placeholder="Lowest Label" />
        </div>
        <div class="flex items-center">
          <Label>Highest Label</Label>
          <Input v-model="element.props.highestLabel" placeholder="Highest Label" />
        </div>
      </div></div
  ></Card>
</template>
