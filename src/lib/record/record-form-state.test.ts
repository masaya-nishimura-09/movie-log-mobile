import { describe, expect, it } from "vitest";
import {
  applyMovie,
  newCreditRow,
  toFormState,
  toRecordInputValues,
} from "@/lib/record/record-form-state";
import type { RecordFormValues } from "@/schemas/record/record-form";

const values: RecordFormValues = {
  title: "Arrival",
  watchedAt: "2026-10-10T15:00:00Z",
  score: 5,
  platform: "netflix",
  releaseYear: 2016,
  runtime: 116,
  genres: ["drama"],
  countries: ["US"],
  language: "en",
  credits: [{ personName: "Amy Adams", creditRole: "cast" }],
  posterUrl: "",
  moodTags: ["moving"],
  memo: "good",
};

describe("newCreditRow", () => {
  it("gives every row its own key", () => {
    expect(newCreditRow().key).not.toBe(newCreditRow().key);
    expect(newCreditRow("cast", "A")).toMatchObject({
      creditRole: "cast",
      personName: "A",
    });
  });
});

describe("toFormState", () => {
  it("turns the values into text fields in the local date", () => {
    expect(toFormState(values)).toMatchObject({
      title: "Arrival",
      watchedAt: "2026-10-11",
      releaseYear: "2016",
      runtime: "116",
      credits: [{ personName: "Amy Adams", creditRole: "cast" }],
    });
  });

  it("starts with one empty credit row and an empty year when there are none", () => {
    const state = toFormState({
      ...values,
      releaseYear: undefined,
      credits: [],
    });
    expect(state.releaseYear).toBe("");
    expect(state.credits).toHaveLength(1);
    expect(state.credits[0]).toMatchObject({
      creditRole: "director",
      personName: "",
    });
  });
});

describe("applyMovie", () => {
  it("replaces the movie fields and keeps the others", () => {
    const state = toFormState(values);
    const next = applyMovie(state, {
      title: "Contact",
      releaseYear: undefined,
      runtime: 150,
      genres: ["drama", "mystery"],
      countries: ["US", "JP"],
      language: "en",
      credits: [],
      posterUrl: "https://example.com/p.jpg",
    });
    expect(next).toMatchObject({
      title: "Contact",
      releaseYear: "",
      runtime: "150",
      genres: ["drama", "mystery"],
      posterUrl: "https://example.com/p.jpg",
      memo: "good",
      score: 5,
    });
    expect(next.credits).toHaveLength(1);
  });
});

describe("toRecordInputValues", () => {
  it("converts the state to the values the API input expects", () => {
    expect(toRecordInputValues(toFormState(values))).toMatchObject({
      watchedAt: "2026-10-10T15:00:00.000Z",
      score: 5,
      platform: "netflix",
      releaseYear: "2016",
      runtime: "116",
    });
  });

  it("trims names, drops empty credits and fills blanks", () => {
    const state = {
      ...toFormState(values),
      score: undefined,
      platform: undefined,
      runtime: "",
      posterUrl: " https://example.com/p.jpg ",
      credits: [
        newCreditRow("cast", "  Amy Adams "),
        newCreditRow("director", "   "),
      ],
    };
    expect(toRecordInputValues(state)).toMatchObject({
      score: "",
      platform: "",
      runtime: "0",
      posterUrl: "https://example.com/p.jpg",
      credits: [{ personName: "Amy Adams", creditRole: "cast" }],
    });
  });
});
