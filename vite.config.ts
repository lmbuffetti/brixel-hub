import {defineConfig} from 'vite';
import {createHtmlPlugin} from 'vite-plugin-html';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'src',
  build: {
    // Relative to the root
    outDir: '../dist',
  },
  plugins: [
    createHtmlPlugin({
      inject: {
        data: {
          title: 'My site',
          googleAnalyticsId: 'My site',
          transifexKey: 'My site',
        },
      },
    }),
    react({
      // Use React plugin in all *.jsx and *.tsx files
      include: '**/*.{jsx,tsx}',
    }),
  ],
});
