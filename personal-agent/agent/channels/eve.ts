import { eveChannel } from "eve/channels/eve";
import {
  localDev,
  placeholderAuth,
  vercelOidc,
  type AuthFn,
  withAuthChallenges,
} from "eve/channels/auth";
import { sessionFromRequest } from "../../src/server/auth-core";

function appSession(): AuthFn<Request> {
  return withAuthChallenges(async (request) => {
    const session = sessionFromRequest(request);
    if (!session) return null;
    return {
      attributes: { email: session.email, displayName: session.displayName },
      authenticator: "app-session",
      principalId: session.userId,
      principalType: "user",
    };
  }, [{ scheme: "Bearer" }]);
}

export default eveChannel({
  auth: [
    appSession(),
    // Lets the eve TUI and Vercel deployments reach the deployed agent.
    vercelOidc(),
    // Open on localhost for `eve dev` and the REPL.
    localDev(),
    // Browser placeholder for local Next without cookie yet — replace in production.
    placeholderAuth(),
  ],
});
