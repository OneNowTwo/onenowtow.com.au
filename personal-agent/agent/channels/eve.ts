import { eveChannel } from "eve/channels/eve";
import {
  localDev,
  vercelOidc,
  type AuthFn,
  withAuthChallenges,
  UnauthenticatedError,
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

/** Fail closed in production: no placeholderAuth that admits anonymous browsers. */
function productionGate(): AuthFn<Request> {
  return async () => {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
      throw new UnauthenticatedError({
        code: "authentication_required",
        message: "Sign in with Google to use Personal Agent.",
      });
    }
    return null;
  };
}

export default eveChannel({
  auth: [
    appSession(),
    vercelOidc(),
    localDev(),
    // Local-only fallthrough for eve REPL; production rejects above.
    productionGate(),
  ],
});
