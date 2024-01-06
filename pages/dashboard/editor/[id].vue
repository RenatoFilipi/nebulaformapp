<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import type { statusType } from "~/lib/utils.types";
import { useEditorStore } from "~/stores/editor";
import { watch } from "vue";
import type { openEndedProps, multipleChoiceProps, likertScaleProps, elementProps } from "~/lib/utils.interfaces";
import { LayoutGrid } from "lucide-vue-next";
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

onBeforeMount(() => {
  editorStore.setFormId(route.params.id as string);
});

onBeforeUnmount(() => {
  editorStore.reset();
});

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
  console.log(questions.value);
};

afterFormFetch();
afterQuestionsFetch();
</script>

<template>
  <div class="pt-16">
    <div class="mt-4 flex justify-center items-center">
      <div v-if="statusQuestions === 'isIdle'" class="flex flex-col gap-6">
        <span v-for="(question, index) in questions" :key="index">{{ question.id }}</span>
      </div>
    </div>
  </div>
</template>
