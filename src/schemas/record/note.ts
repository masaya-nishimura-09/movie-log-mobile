import { z } from "zod";

export type NoteMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type NoteNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: NoteNode[];
  marks?: NoteMark[];
  text?: string;
};

export const noteContentSchema = z.custom<NoteNode>(
  (value) =>
    typeof value === "object" && value !== null && !Array.isArray(value),
);

export type Note = NoteNode;

export const noteResponseSchema = noteContentSchema;

export type NoteResponse = NoteNode;
