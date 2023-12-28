<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import type { statusType } from "~/lib/utils.types";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "~/stores/editor";
import { watch } from "vue";
import type { openEndedProps, multipleChoiceProps, likertScaleProps } from "~/lib/utils.interfaces";
import { LayoutGrid, Loader2 } from "lucide-vue-next";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();
const editorStore = useEditorStore();

useHead({
  title: "Editor - Nebulaform",
});

definePageMeta({
  layout: "application",
});

watch(
  user,
  () => {
    if (!user.value) {
      return navigateTo("/login");
    }
  },
  { immediate: true }
);

const status = ref<statusType>("isIdle");
const formName = ref("");

watch(formName, (value) => {
  editorStore.setFormName(value);
});

onBeforeUnmount(() => {
  editorStore.reset();
});

editorStore.setFormId(route.params.id as string);
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="flex flex-1 w-full flex-col py-40 px-80 gap-12">
        <div class="flex justify-between items-center">
          <div><Input class="min-w-96" placeholder="Form Name" v-model.trim="formName" /></div>
          <ApplicationPagesEditorAddElementButton />
        </div>
        <div v-if="status === 'isLoading'" class="flex justify-center items-center py-20">
          <div class="animate-spin">
            <Loader2 className="w-4 h-4" />
          </div>
        </div>
        <div
          v-if="status === 'isIdle' && editorStore.formElements.length <= 0"
          class="border flex justify-center items-center p-40">
          <div class="flex flex-col items-center justify-center">
            <LayoutGrid class="mb-2 w-6 h-6" />
            <span class="mb-2">No element to show</span>
            <span class="text-sm text-zinc-500">Start by adding elements to publish.</span>
          </div>
        </div>
        <div v-if="status === 'isIdle' && editorStore.formElements.length >= 1" class="flex flex-col gap-4">
          <div v-for="(element, index) in editorStore.formElements" :key="index">
            <ApplicationPagesEditorMultipleChoice
              v-if="element.type == 'multipleChoice'"
              :id="element.id"
              :name="element.name"
              type="multipleChoice"
              :props="(element.props as multipleChoiceProps)" />
            <ApplicationPagesEditorOpenEnded
              v-if="element.type == 'openEnded'"
              :id="element.id"
              :name="element.name"
              type="openEnded"
              :props="(element.props as openEndedProps)" />
            <ApplicationPagesEditorLikertScale
              v-if="element.type == 'likertScale'"
              :id="element.id"
              :name="element.name"
              type="likertScale"
              :props="(element.props as likertScaleProps)" />
          </div>
        </div>
        <div v-if="status === 'isRejected'" class="flex flex-col justify-center items-center py-20 gap-6">
          <span class="text-zinc-500 text-sm">Something went wrong, please try again.</span>
        </div>
      </div>
    </div>
  </div>
</template>
