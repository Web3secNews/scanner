// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    preset: "deno"
  },
  runtimeConfig: {
    defiApiKey: process.env.DEFI_API_KEY,
  },
  modules: ["@nuxtjs/tailwindcss"],
  tailwindcss: {
    cssPath: "~/assets/styles/globals.css",
  },
  experimental: {
    typedPages: true,
  }
});
