<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import type { statusType } from "~/lib/utils.type";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-vue-next";
import type { SBformsType } from "~/lib/utils.type";

const supabase = useSupabaseClient<Database>();
const user = useSupabaseUser();

useHead({
  title: "Dashboard - Nebulaform",
});

definePageMeta({
  layout: "application",
});

const status = ref<statusType>("isLoading");
const forms = ref<SBformsType[]>([]);

const { data } = await useAsyncData("forms", async () => {
  status.value = "isLoading";

  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("owner_id", user.value?.id as string);

  if (error) {
    return { data: null, error };
  }

  return { data, error };
});

if (data.value !== null) {
  if (!data.value.error) {
    if (data.value.data !== null) {
      forms.value = data.value.data;
      status.value = "isIdle";
    }
  }
} else {
  status.value = "isRejected";
}
</script>

<template>
  <div>
    <div class="flex flex-col items-center">
      <div class="flex flex-1 w-full flex-col py-40 px-80 gap-12">
        <div class="flex justify-between items-center">
          <span class="font-bold text-3xl">Forms</span>
          <div><ApplicationSharedCreateFormButton /></div>
        </div>
        <div v-if="status === 'isLoading'" class="flex justify-center items-center py-20">
          <Loader2 className="animate-spin w-4 h-4" />
        </div>
        <Card v-if="status === 'isIdle' && forms.length <= 0" class="flex justify-center items-center">
          <div class="flex justify-center items-center flex-col p-40">
            <div class="flex flex-col items-center justify-center">
              <span class="mb-2">No form to show</span>
              <span class="text-sm text-zinc-500">Create a form to get started.</span>
            </div>
          </div>
        </Card>
        <ul v-if="status === 'isIdle' && forms.length > 0" class="grid grid-cols-3 gap-6">
          <li v-for="(form, index) in forms" :key="index">
            <NuxtLink :to="'/dashboard/form/' + form.id">
              <Card class="p-6 h-40 flex flex-col justify-between hover:border-primary">
                <span class="text-lg font-bold">{{ form.title }}</span>
                <div>
                  <span class="text-zinc-500">{{ form.responses }} responses</span>
                </div>
              </Card>
            </NuxtLink>
          </li>
        </ul>
        <div v-if="status === 'isRejected'" class="flex flex-col justify-center items-center py-20 gap-6">
          <span>Something went wrong, please try again.</span>
        </div>
      </div>
    </div>
  </div>
</template>
