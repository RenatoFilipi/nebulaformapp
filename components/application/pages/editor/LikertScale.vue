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
  <Card :key="element.id" class="p-6 hover:border-primary border-dashed border-2 transition"
    ><div class="flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <div class="flex justify-center items-center gap-4">
          <Label>Question</Label>
          <Input v-model="element.props.question" />
        </div>
        <div class="flex justify-center items-center gap-4">
          <AlertDialog>
            <AlertDialogTrigger as-child>
              <Button size="sm" variant="outline"><Trash class="w-4 h-4" /></Button
            ></AlertDialogTrigger>
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
        <Input v-model="element.props.description" placeholder="(optional)" />
      </div>
      <div class="mt-4">
        <div class="flex items-center gap-4 py-2">
          <Label>Lowest</Label>
          <Input v-model="element.props.lowestLabel" placeholder="Lowest Label" />
        </div>
        <div class="flex items-center gap-4 py-2">
          <Label>Highest</Label>
          <Input v-model="element.props.highestLabel" placeholder="Highest Label" />
        </div>
      </div></div
  ></Card>
</template>
