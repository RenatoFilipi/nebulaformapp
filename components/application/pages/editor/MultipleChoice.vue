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
import { AlertCircle, Plus } from "lucide-vue-next";

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
  element.props.options.push({ value: newUuid(), label: "Option Label" });
};
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
                <AlertDialogTitle class="flex justify-start items-center"
                  ><AlertCircle class="mr-2 w-6 h-6 text-red-500" />Are you absolutely sure?</AlertDialogTitle
                >
                <AlertDialogDescription class="text-red-500">
                  This action cannot be undone. This will permanently delete this element of the form and all
                  information related to it.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction as-child
                  ><Button type="button" @click="editorStore.removeElement(element.id)"
                    >Delete</Button
                  ></AlertDialogAction
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
      <div class="flex flex-col gap-4 mt-4">
        <div>
          <div
            v-for="(option, index) in element.props.options"
            :key="index"
            class="flex justify-start items-center py-2 gap-2">
            <div class="flex items-center gap-4">
              <Label :for="option.value" class="text-neutral-500">{{ index + 1 }}</Label>
              <Input :id="option.value" v-model="option.label" />
            </div>
            <div>
              <Button
                variant="secondary"
                size="sm"
                @click="handleDeleteOption(option.value)"
                :disabled="element.props.options.length <= 2"
                ><Trash class="w-4 h-4"
              /></Button>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          type="button"
          class="w-36"
          @click="handleAddOption"
          variant="outline"
          :disabled="element.props.options.length >= 6"
          ><Plus class="mr-2 w-4 h-4" />Add Option</Button
        >
      </div>
    </div>
  </Card>
</template>
