<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import type { statusType } from "~/lib/utils.types";
import { Input } from "@/components/ui/input";
import { useEditorStore } from "~/stores/editor";
import { watch } from "vue";
import type { openEndedProps, multipleChoiceProps, likertScaleProps } from "~/lib/utils.interfaces";
import { LayoutGrid, Loader2 } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import type { SBformsType } from "~/lib/utils.types";
import { formatISO } from "date-fns";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();
const editorStore = useEditorStore();
const { toast } = useToast();

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
const form = ref<SBformsType>({
  id: "",
  owner_id: "",
  public_id: "",
  created_at: "",
  updated_at: "",
  mode: "",
  title: "",
  description: "",
  responses: 0,
});

const isSavingForm = ref(false);

onBeforeMount(() => {
  editorStore.setFormId(route.params.id as string);
});

onBeforeUnmount(() => {
  editorStore.reset();
});

const handleSaveForm = async () => {
  try {
    isSavingForm.value = true;

    const { data: formData, error: formError } = await supabase
      .from("forms")
      .update({ title: editorStore.formName })
      .eq("id", editorStore.formId)
      .select()
      .single();

    if (formError) throw new Error(formError.message);

    for (const el of editorStore.formElements) {
      const { data: questionData, error: questionError } = await supabase
        .from("questions")
        .insert([
          {
            form_id: formData.id,
            owner_id: user.value?.id as string,
            type: el.type,
            question: el.props.question,
            description: el.props.description,
          },
        ])
        .select()
        .single();

      if (questionError) throw new Error(questionError.message);
    }

    //navigateTo("/dashboard/form/" + editorStore.formId);
  } catch (err: any) {
    toast({
      variant: "destructive",
      description: err.message,
    });
  } finally {
    isSavingForm.value = false;
  }
};

const { data } = await useAsyncData("form", async () => {
  status.value = "isLoading";

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", user.value?.id as string)
    .single();

  return { data, error };
});

if (data.value !== null) {
  if (!data.value.error) {
    if (data.value.data !== null) {
      form.value = data.value.data;
      status.value = "isIdle";
    }
  }
} else {
  status.value = "isRejected";
}

editorStore.setFormName(form.value.title as string);
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="flex flex-1 w-full flex-col py-40 px-80 gap-12">
        <div class="flex justify-between items-center">
          <div>
            <Input v-if="!isSavingForm" class="min-w-96" placeholder="Form Name" v-model.trim="editorStore.name" />
            <span v-else class="">{{ editorStore.name }}</span>
          </div>
          <Button @click="handleSaveForm" :disabled="isSavingForm"
            ><div class="flex justify-center items-center" v-if="isSavingForm">
              <Loader2 class="animate-spin mr-2 h-4 w-4" />Saving
            </div>
            <div v-else>Save</div>
          </Button>
        </div>
        <div :class="isSavingForm ? 'blur-sm pointer-events-none select-none' : null">
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
              <span class="text-sm text-zinc-500 mb-6">Start by adding elements to publish.</span>
              <ApplicationPagesEditorAddElementButton />
            </div>
          </div>
          <div v-if="status === 'isIdle' && editorStore.formElements.length >= 1" class="flex flex-col gap-10">
            <div v-for="(element, index) in editorStore.formElements" :key="index">
              <ApplicationPagesEditorMultipleChoice
                v-if="element.type === 'multipleChoice'"
                :id="element.id"
                type="multipleChoice"
                :props="element.props as multipleChoiceProps" />
              <ApplicationPagesEditorOpenEnded
                v-if="element.type === 'openEnded'"
                :id="element.id"
                type="openEnded"
                :props="element.props as openEndedProps" />
              <ApplicationPagesEditorLikertScale
                v-if="element.type === 'likertScale'"
                :id="element.id"
                type="likertScale"
                :props="element.props as likertScaleProps" />
            </div>
            <div class="flex justify-center items-center w-full"><ApplicationPagesEditorAddElementButton /></div>
          </div>
          <div v-if="status === 'isRejected'" class="flex flex-col justify-center items-center py-20 gap-6">
            <span class="text-zinc-500 text-sm">Something went wrong, please try again.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
