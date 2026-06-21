import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { AuthType } from "./auth";

export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<AuthType>()
  ]
});
