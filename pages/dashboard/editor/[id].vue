<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import type { statusType } from "~/lib/utils.types";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "~/stores/editor";
import { watch } from "vue";

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

const status = ref<statusType>("isLoading");
const formName = ref("");

watch(formName, (value) => {
  editorStore.setFormName(value);
});

editorStore.setFormId(route.params.id as string);
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="flex flex-1 w-full flex-col py-40 px-80 gap-2">
        <div class="flex justify-between items-center">
          <div><Input placeholder="Form Name" v-model.trim="formName" /></div>
          <ApplicationPagesEditorAddElementButton />
        </div>
      </div>
    </div>
  </div>
</template>
