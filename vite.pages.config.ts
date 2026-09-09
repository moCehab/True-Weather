import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { fileURLToPath } from 'node:url';
const project=fileURLToPath(new URL('.',import.meta.url));
const base=(process.env.PAGES_BASE_PATH||'').replace(/\/$/,'');
if(base&&!/^\/[a-zA-Z0-9._/-]+$/.test(base))throw Error('PAGES_BASE_PATH must be empty or an absolute URL path.');
export default defineConfig({
 root:`${project}pages`,publicDir:`${project}public`,base:`${base}/`,
 plugins:[react()],resolve:{alias:{'@':project}},
 define:{'process.env.NEXT_PUBLIC_STATIC_HOSTING':JSON.stringify('true'),'process.env.NEXT_PUBLIC_BASE_PATH':JSON.stringify(base)},
 css:{postcss:{plugins:[tailwindcss()]}},
 build:{outDir:`${project}dist/pages`,emptyOutDir:true},
});
