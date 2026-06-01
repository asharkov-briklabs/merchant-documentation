import { type TextUIPart, type UIMessage } from "ai";

/** Extract plain text from a v6 UIMessage's parts array. */
export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((p): p is TextUIPart => p.type === "text")
    .map((p) => p.text)
    .join("");
}
