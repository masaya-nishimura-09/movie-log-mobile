import type { NoteNode } from "@/schemas/record/note";

export function hasText(node: NoteNode): boolean {
  return (node.text ?? "").trim() !== "" || (node.content ?? []).some(hasText);
}
