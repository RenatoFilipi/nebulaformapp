<script setup lang="ts">
import { CreditCard, LifeBuoy, LogOut, Settings, User } from "lucide-vue-next";
import type { Database } from "~/lib/database.types";
const user = useSupabaseUser();
const supabase = useSupabaseClient<Database>();

const avatarUser = computed(() => {
  const email = user.value?.email as string;
  return email.slice(0, 2).toUpperCase();
});

const onLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    return;
  }
  return navigateTo("/login");
};
</script>

<template>
  <div>
    <header class="flex flex-col border-b bg-white fixed w-screen z-10">
      <div class="flex justify-between items-center w-full px-6 h-16">
        <div class="flex justify-center items-center gap-16">
          <NuxtLink to="/dashboard">
            <NuxtImg src="/brand/logodark.svg" width="35" />
          </NuxtLink>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Avatar class="cursor-pointer"
                ><AvatarFallback>{{ avatarUser }}</AvatarFallback></Avatar
              >
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User class="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard class="mr-2 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings class="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LifeBuoy class="mr-2 h-4 w-4" />
                <span>Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem @click="onLogout">
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  </div>
</template>
