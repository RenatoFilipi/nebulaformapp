<script setup lang="ts">
import type { Database } from "~/lib/database.types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Home, LogOut } from "lucide-vue-next";

const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const avatarMail = ref("");

const onLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    return;
  }
  return navigateTo("/login");
};

const email = user.value?.email as string;
avatarMail.value = email.slice(0, 2).toUpperCase();
</script>

<template>
  <div>
    <header class="flex flex-col border-b bg-white fixed w-screen z-10">
      <div class="flex justify-between items-center w-full px-6 h-14">
        <div class="flex justify-center items-center gap-4">
          <NuxtLink to="/dashboard">
            <NuxtImg src="/images/brand/logodark.svg" width="30" />
          </NuxtLink>
          <nav class="flex justify-center items-center gap-6">
            <Button as-child variant="ghost"
              ><NuxtLink to="/dashboard" class="text-sm font-light"
                ><Home class="mr-2 w-4 h-4" stroke-width="1" />Dashboard</NuxtLink
              ></Button
            >
          </nav>
        </div>
        <div class="flex justify-center items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger as-child
              ><Avatar class="cursor-pointer"
                ><AvatarFallback>{{ avatarMail }}</AvatarFallback></Avatar
              ></DropdownMenuTrigger
            >
            <DropdownMenuContent class="mr-7 w-[250px]">
              <DropdownMenuItem><NuxtLink to="/">Homepage</NuxtLink></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="onLogout"><LogOut class="mr-2 w-4 h-4" />Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  </div>
</template>
