<script setup lang="ts">
import { Box, Loader2 } from "lucide-vue-next";
import type { Database } from "~/lib/database.types";
import { parseFormatDistanceDate } from "~/lib/utils";
import type { SBformsType, statusType } from "~/lib/utils.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const { data } = await useAsyncData("form", async () => {
  statusResponses.value = "isLoading";
  statusShare.value = "isLoading";
  statusSettings.value = "isLoading";

  const { data, error } = await supabase.from("forms").select("*").eq("id", route.params.id).single();
  return { data, error };
});

if (data.value !== null) {
  if (!data.value.error) {
    if (data.value.data !== null) {
      if (data.value.data.owner_id === (user.value?.id as string)) {
        form.value = data.value.data;
        statusResponses.value = "isIdle";
        statusShare.value = "isIdle";
        statusSettings.value = "isIdle";
      } else {
        navigateTo("/dashboard");
      }
    }
  }
} else {
  statusResponses.value = "isRejected";
  statusShare.value = "isRejected";
  statusSettings.value = "isRejected";
}
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
              <Loader2 class="w-6 h-6" />
            </div>
          </Card>
          <Card v-if="statusResponses === 'isIdle'" class="flex flex-col">
            <div class="border-b p-3"><span class="text-zinc-500">Latest form activity</span></div>
            <div class="flex justify-center items-center p-44">
              <span class="text-zinc-500 text-sm">No form responses to show.</span>
            </div>
          </Card></TabsContent
        >
        <TabsContent value="share">Working in progress - Share</TabsContent>
        <TabsContent value="settings">Working in progress - Settings</TabsContent>
      </div>
    </Tabs>
  </div>
</template>
