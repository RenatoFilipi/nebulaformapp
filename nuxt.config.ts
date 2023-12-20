// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    ["@nuxtjs/google-fonts", { families: { Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900] } }],
    "@nuxtjs/supabase",
  ],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  tailwindcss: {
    viewer: false,
  },
  googleFonts: {
    preload: true,
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "confirm",
      exclude: ["/"],
    },
  },
});
