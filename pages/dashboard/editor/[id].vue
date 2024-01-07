<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import type { statusType } from "~/lib/utils.types";
import { useEditorStore } from "~/stores/editor";
import { watch } from "vue";
import type { openEndedProps, multipleChoiceProps, likertScaleProps, elementProps } from "~/lib/utils.interfaces";
import { LayoutGrid, Loader2 } from "lucide-vue-next";
import { useToast } from "@/components/ui/toast/use-toast";
import type { SBformsType, SBquestionsType } from "~/lib/utils.types";
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

const statusForm = ref<statusType>("isLoading");
const statusQuestions = ref<statusType>("isLoading");
const form = ref<SBformsType>({
  created_at: "",
  id: "",
  owner_id: "",
  responses: 0,
  title: "",
  updated_at: "",
  description: "",
  public_id: "",
  mode: "",
});
const questions = ref<elementProps[]>([]);

const { data: dataForm } = await useAsyncData("form", async () => {
  statusForm.value = "isLoading";
  const { data, error } = await supabase.from("forms").select("*").eq("id", route.params.id).single();
  return { data, error };
});

const { data: dataQuestions } = await useAsyncData("questions", async () => {
  statusQuestions.value = "isLoading";
  const { data: dataFetch, error } = await supabase.from("questions").select("*").eq("form_id", route.params.id);
  const data = dataFetch !== null ? dataFetch : [];
  return { data, error };
});

const afterFormFetch = () => {
  if (dataForm.value === null || dataForm.value.error || dataForm.value.data === null) {
    navigateTo("/dashboard");
    return;
  }
  if (dataForm.value.data.owner_id !== (user.value?.id as string)) {
    navigateTo("/dashboard");
  }
  form.value = dataForm.value.data;
  statusForm.value = "isIdle";
};

const afterQuestionsFetch = async () => {
  if (dataQuestions.value === null || dataQuestions.value.error) {
    statusQuestions.value = "isRejected";
    return;
  }
  if (dataQuestions.value.data.length <= 0) {
    statusQuestions.value = "isIdle";
    return;
  }

  for (let question of dataQuestions.value.data) {
    switch (question.type) {
      case "multipleChoice":
        {
          const { data, error } = await supabase
            .from("questions_multiple_choice")
            .select("id, value, label")
            .eq("question_id", question.id);

          if (error) {
            statusQuestions.value = "isRejected";
            return;
          }

          const templateElementProps: multipleChoiceProps = {
            question: question.question,
            description: question.description === null ? "" : question.description,
            options: data === null ? [] : data,
          };

          const templateElement: elementProps = {
            id: question.id,
            type: "multipleChoice",
            props: templateElementProps,
          };
          questions.value.push(templateElement);
        }
        break;
      case "openEnded":
        {
          const templateElementProps: openEndedProps = {
            question: question.question,
            description: question.description === null ? "" : question.description,
          };

          const templateElement: elementProps = {
            id: question.id,
            type: question.type,
            props: templateElementProps,
          };
          questions.value.push(templateElement);
        }
        break;
      case "likertScale":
        {
          const { data, error } = await supabase
            .from("questions_likert_scale")
            .select("id, lowest_label, highest_label")
            .eq("question_id", question.id)
            .single();

          if (error) {
            statusQuestions.value = "isRejected";
            return;
          }

          const templateElementProps: likertScaleProps = {
            id: data.id,
            question: question.question,
            description: question.description === null ? "" : question.description,
            lowestLabel: data.lowest_label,
            highestLabel: data.highest_label,
          };

          const templateElement: elementProps = {
            id: question.id,
            type: "likertScale",
            props: templateElementProps,
          };
          questions.value.push(templateElement);
        }
        break;
    }
  }
  statusQuestions.value = "isIdle";
};

afterFormFetch();
afterQuestionsFetch();
</script>

<template>
  <div class="pt-24">
    <Tabs default-value="blocks">
      <div class="flex justify-center items-center gap-4">
        <TabsList>
          <TabsTrigger value="blocks">Blocks</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <Button>Publish</Button>
      </div>
      <div class="flex justify-center items-center p-4 mt-10">
        <TabsContent value="blocks"
          ><div class="mt-24" v-if="statusQuestions === 'isLoading'">
            <div class="animate-spin">
              <Loader2 class="w-6 h-6 text-primary" />
            </div>
          </div>
          <div class="mt-24" v-if="statusQuestions === 'isRejected'">
            <div class="">
              <span>Something went wrong, please try again.</span>
            </div>
          </div>
          <div v-if="statusQuestions === 'isIdle' && questions.length <= 0">Empty</div></TabsContent
        >
        <TabsContent value="preview">wip - Preview</TabsContent>
      </div>
    </Tabs>
  </div>
</template>
