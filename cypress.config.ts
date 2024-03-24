import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    experimentalStudio: true,

    setupNodeEvents(/* on:any, config */) {
      // implement node event listeners here
    },
  },
});
