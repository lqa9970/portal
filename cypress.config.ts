import { defineConfig } from 'cypress'
import * as dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  e2e: {
    env: {
      tenantId: process.env.CYPRESS_TENANT_ID,
      clientId: process.env.CYPRESS_BACKEND_CLIENT_ID,
      clientSecret: process.env.CYPRESS_CLIENT_SECRET,
      username: process.env.CYPRESS_TEST_USERNAME,
      password: process.env.CYPRESS_TEST_PASSWORD,
      backendIdentifier: process.env.CYPRESS_BACKEND_IDENTIFIER,
    },
  },
})
