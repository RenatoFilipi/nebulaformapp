<script setup lang="ts">
import { Box, Pencil, Share, Eye } from "lucide-vue-next";
import type { Database } from "~/lib/database.types";
import { parseFormatDistanceDate } from "~/lib/utils";
import type { SBformsType, statusType } from "~/lib/utils.types";

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

const status = ref<statusType>("isLoading");
const statusResponses = ref<statusType>("isLoading");
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
  status.value = "isLoading";

  const { data, error } = await supabase.from("forms").select("*").eq("id", route.params.id).single();
  return { data, error };
});

if (data.value !== null) {
  if (!data.value.error) {
    if (data.value.data !== null) {
      if (data.value.data.owner_id === (user.value?.id as string)) {
        form.value = data.value.data;
        status.value = "isIdle";
      } else {
        navigateTo("/dashboard");
      }
    }
  }
} else {
  status.value = "isRejected";
}
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="flex flex-1 w-full flex-col py-40 px-80 gap-2">
        <div class="flex justify-between items-center">
          <div class="flex justify-center items-center gap-6">
            <div class="flex items-center justify-center gap-2">
              <Box />
              <span class="font-semibold text-xl">{{ form.title }}</span>
            </div>
            <Badge variant="outline">{{ form.responses }} responses</Badge>
          </div>
          <div class="flex justify-center items-center gap-4">
            <Button variant="outline"><Eye class="mr-2 w-4 h-4" />Preview</Button>
            <Button variant="outline"><Share class="mr-2 w-4 h-4" />Share</Button>
            <Button as-child
              ><NuxtLink :to="'/dashboard/editor/' + form.id"><Pencil class="mr-2 w-4 h-4" />Edit</NuxtLink>
            </Button>
          </div>
        </div>
        <div>
          <span class="text-zinc-500 text-sm">Last update was {{ parseFormatDistanceDate(form.updated_at) }}</span>
        </div>
        <div class="mt-10">
          <Card class="flex flex-col">
            <div class="border-b p-3"><span class="text-zinc-500">Latest form activity</span></div>
            <div v-if="statusResponses === 'isLoading'" class="flex justify-center items-center p-44">
              <span class="text-zinc-500 text-sm">No form responses to show.</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
