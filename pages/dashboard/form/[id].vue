<script setup lang="ts">
import { Box, Loader2 } from "lucide-vue-next";
import type { Database } from "~/lib/database.types";
import { parseFormatDistanceDate } from "~/lib/utils";
import type { SBformsType, statusType, SBresponsesType } from "~/lib/utils.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { parseFormatDateWithDistanceDate } from "~/lib/utils";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();
const route = useRoute();

useHead({
  title: "Form - Nebulaform",
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
const statusResponses = ref<statusType>("isLoading");
const statusSettings = ref<statusType>("isLoading");
const statusShare = ref<statusType>("isLoading");

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

const responses = ref<SBresponsesType[]>([]);

const { data: dataForm } = await useAsyncData("form", async () => {
  statusForm.value = "isLoading";

  const { data, error } = await supabase.from("forms").select("*").eq("id", route.params.id).single();
  return { data, error };
});

const { data: dataResponses } = await useAsyncData("responses", async () => {
  statusResponses.value = "isLoading";

  const { data: dataFetch, error } = await supabase.from("responses").select("*").eq("form_id", route.params.id);
  const data = dataFetch !== null ? dataFetch : [];
  return { data, error };
});

const afterFormFetch = () => {
  if (dataForm.value === null || dataForm.value.error || dataForm.value.data === null) {
    statusForm.value = "isRejected";
    return;
  }
  if (dataForm.value.data.owner_id !== (user.value?.id as string)) {
    navigateTo("/dashboard");
  }
  form.value = dataForm.value.data;
  statusForm.value = "isIdle";
};

const afterResponsesFetch = () => {
  if (dataResponses.value === null || dataResponses.value.error) {
    statusResponses.value = "isRejected";
    return;
  }
  responses.value = dataResponses.value.data;
  statusResponses.value = "isIdle";
};

afterFormFetch();
afterResponsesFetch();
</script>

<template>
  <div class="flex flex-col items-center">
    <Tabs default-value="responses" class="flex flex-1 w-full flex-col py-40 px-80 gap-2">
      <div class="flex justify-between items-center">
        <div class="flex justify-center items-center gap-6">
          <div class="flex items-center justify-center gap-2">
            <Box />
            <span class="font-semibold text-xl">{{ form.title }}</span>
          </div>
          <Badge variant="outline">{{ form.responses }} {{ form.responses === 1 ? "response" : "responses" }}</Badge>
        </div>
        <div class="flex justify-center items-center gap-4">
          <TabsList>
            <TabsTrigger value="responses">Responses</TabsTrigger>
            <TabsTrigger value="share">Share</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <Button as-child><NuxtLink :to="'/dashboard/editor/' + form.id">Editor</NuxtLink> </Button>
        </div>
      </div>
      <div>
        <span class="text-zinc-500 text-sm">Last update was {{ parseFormatDistanceDate(form.updated_at) }}</span>
      </div>
      <div class="mt-10">
        <TabsContent value="responses">
          <Card v-if="statusResponses === 'isLoading'" class="flex justify-center items-center py-44">
            <div class="animate-spin">
              <Loader2 class="w-6 h-6 text-primary" />
            </div>
          </Card>
          <Card v-if="statusResponses === 'isIdle' && responses.length <= 0" class="flex flex-col">
            <div class="border-b p-3"><span class="text-zinc-500">Latest form activity</span></div>
            <div class="flex justify-center items-center p-44">
              <span class="text-zinc-500 text-sm">No form responses to show.</span>
            </div>
          </Card>
          <Card v-if="statusResponses === 'isIdle' && responses.length >= 1" class="flex flex-col">
            <div class="border-b p-3"><span class="text-zinc-500">Latest form activity</span></div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identifier</TableHead>
                  <TableHead>Submited</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow class="text-neutral-700" v-for="(response, index) in responses" :key="index">
                  <TableCell># {{ response.id }}</TableCell>
                  <TableCell>{{ parseFormatDateWithDistanceDate(response.created_at) }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card></TabsContent
        >
        <TabsContent value="share">Working in progress - Share</TabsContent>
        <TabsContent value="settings">Working in progress - Settings</TabsContent>
      </div>
    </Tabs>
  </div>
</template>
