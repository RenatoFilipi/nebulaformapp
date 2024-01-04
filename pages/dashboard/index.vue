<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import { Card } from "@/components/ui/card";
import { Loader2, Box } from "lucide-vue-next";
import type { SBformsType, statusType } from "~/lib/utils.types";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

useHead({
  title: "Dashboard - Nebulaform",
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

const statusForms = ref<statusType>("isLoading");
const forms = ref<SBformsType[]>([]);

const { data: dataForms } = await useAsyncData("forms", async () => {
  statusForms.value = "isLoading";
  const { data: dataFetch, error } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", user.value?.id as string);

  const data = dataFetch !== null ? dataFetch : [];
  return { data, error };
});

const afterFormsFetch = () => {
  if (dataForms.value === null || dataForms.value.error) {
    statusForms.value = "isRejected";
    return;
  }

  forms.value = dataForms.value.data;
  statusForms.value = "isIdle";
};

afterFormsFetch();
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="flex flex-1 w-full flex-col py-40 px-80 gap-12">
        <div class="flex justify-between items-center">
          <span class="font-bold text-3xl">Forms</span>
          <div><ApplicationSharedCreateFormButton /></div>
        </div>
        <div v-if="statusForms === 'isLoading'" class="flex justify-center items-center py-20">
          <div class="animate-spin">
            <Loader2 class="w-6 h-6 text-primary" />
          </div>
        </div>
        <Card v-if="statusForms === 'isIdle' && forms.length <= 0" class="flex justify-center items-center">
          <div class="flex justify-center items-center flex-col p-40">
            <div class="flex flex-col items-center justify-center">
              <Box class="mb-2 h-6 w-6" />
              <span class="mb-2">No form to show</span>
              <span class="text-sm text-zinc-500">Create a form to get started.</span>
            </div>
          </div>
        </Card>
        <ul v-if="statusForms === 'isIdle' && forms.length >= 1" class="grid grid-cols-3 gap-6">
          <li v-for="(form, index) in forms" :key="index">
            <NuxtLink :to="'/dashboard/form/' + form.id">
              <Card class="p-6 h-40 flex flex-col justify-between hover:border-primary">
                <div class="">
                  <div class="flex justify-between items-center mb-2">
                    <div class="flex items-center gap-3">
                      <span class="text-lg font-bold">{{ form.title }}</span>
                      <Badge variant="outline">{{ form.mode }}</Badge>
                    </div>
                    <Box />
                  </div>
                </div>

                <div>
                  <span class="text-zinc-500"
                    >{{ form.responses }} {{ form.responses === 1 ? "response" : "responses" }}</span
                  >
                </div>
              </Card>
            </NuxtLink>
          </li>
        </ul>
        <div v-if="statusForms === 'isRejected'" class="flex flex-col justify-center items-center py-20 gap-6">
          <span class="text-zinc-500 text-sm">Something went wrong, please try again.</span>
        </div>
      </div>
    </div>
  </div>
</template>
