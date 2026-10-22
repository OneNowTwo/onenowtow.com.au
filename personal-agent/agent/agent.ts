import { defineAgent } from "eve";

export default defineAgent({
  model: "openai/gpt-5.4",
  reasoning: "medium",
  // No sandbox shell/file tools by default — this agent handles personal data.
  // Re-enable selectively when a capability truly needs them.
  defaultTools: false,
});
