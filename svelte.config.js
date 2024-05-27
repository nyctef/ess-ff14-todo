import azure from 'svelte-adapter-azure-swa';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // https://techcommunity.microsoft.com/t5/apps-on-azure-blog/deploy-full-stack-server-side-rendered-sveltekit-applications-to/ba-p/4092981
    adapter: azure()
  }
};

export default config;
