<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import type { statusType } from "~/lib/utils.types";
import { useEditorStore } from "~/stores/editor";
import { watch } from "vue";
import type { openEndedProps, multipleChoiceProps, likertScaleProps } from "~/lib/utils.interfaces";
import { LayoutGrid } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import type { SBformsType } from "~/lib/utils.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

    // for (const el of editorStore.formElements) {
    //   const { data: questionData, error: questionError } = await supabase
    //     .from("questions")
    //     .insert([
    //       {
    //         form_id: formData.id,
    //         owner_id: user.value?.id as string,
    //         type: el.type,
    //         question: el.props.question,
    //         description: el.props.description,
    //       },
    //     ])
    //     .select()
    //     .single();

    //   if (questionError) throw new Error(questionError.message);
    // }

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

// const { data } = await useAsyncData("form", async () => {
//   status.value = "isLoading";

//   const { data, error } = await supabase
//     .from("forms")
//     .select("*")
//     .eq("owner_id", user.value?.id as string)
//     .single();

//   return { data, error };
// });

// if (data.value !== null) {
//   if (!data.value.error) {
//     if (data.value.data !== null) {
//       form.value = data.value.data;
//       status.value = "isIdle";
//     }
//   }
// } else {
//   status.value = "isRejected";
// }

editorStore.setFormName(form.value.title as string);
</script>

<template>
  <div class="pt-16">
    <div class="mt-4 flex justify-center items-center">
      <Tabs default-value="blocks" class="">
        <div class="flex justify-center items-center gap-4">
          <TabsList>
            <TabsTrigger value="blocks">Blocks</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <Button>Publish</Button>
        </div>
        <div class="flex justify-center items-center p-4 mt-10">
          <TabsContent value="blocks" class="">
            <!-- NO ELEMENTS -->
            <div
              v-if="status === 'isIdle' && editorStore.formElements.length <= 0"
              class="flex justify-center items-center p-40">
              <div class="flex flex-col items-center justify-center">
                <LayoutGrid class="mb-2 w-6 h-6" />
                <span class="mb-2">No element to show</span>
                <span class="text-sm text-zinc-500 mb-6">Start by adding elements to publish.</span>
                <ApplicationPagesEditorAddElementButton />
              </div>
            </div>
            <!-- WITH AT LEAST ONE ELEMENT -->
            <div
              v-if="status === 'isIdle' && editorStore.formElements.length >= 1"
              class="flex flex-col gap-10 min-w-[800px]">
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
              <div class="flex justify-center items-center w-full"><ApplicationPagesEditorAddElementButton /></div></div
          ></TabsContent>
          <TabsContent value="preview">Working in progress - Preview</TabsContent>
          <TabsContent value="settings">Working in progress - Settings</TabsContent>
        </div>
      </Tabs>
    </div>
  </div>
</template>
