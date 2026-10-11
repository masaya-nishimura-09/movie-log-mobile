import { toDateInputValue } from "@/lib/date/format-date";
import { startOfLocalDay } from "@/lib/date/start-of-local-day";
import type { MovieValues } from "@/schemas/movie/movie";
import type {
  CreditRole,
  Genre,
  MoodTag,
  Platform,
} from "@/schemas/record/enums";
import type { RecordFormValues } from "@/schemas/record/record-form";

export type CreditRow = {
  key: string;
  personName: string;
  creditRole: CreditRole;
};

export type RecordFormState = {
  title: string;
  watchedAt: string;
  score: number | undefined;
  platform: Platform | undefined;
  releaseYear: string;
  runtime: string;
  language: string;
  countries: string[];
  genres: Genre[];
  credits: CreditRow[];
  posterUrl: string;
  moodTags: MoodTag[];
  memo: string;
};

let rowSequence = 0;

export function newCreditRow(
  creditRole: CreditRole = "director",
  personName = "",
): CreditRow {
  rowSequence += 1;
  return { key: `credit-${rowSequence}`, creditRole, personName };
}

function toCreditRows(
  credits: { personName: string; creditRole: CreditRole }[],
): CreditRow[] {
  return credits.length > 0
    ? credits.map((c) => newCreditRow(c.creditRole, c.personName))
    : [newCreditRow()];
}

export function toFormState(values: RecordFormValues): RecordFormState {
  return {
    title: values.title,
    watchedAt: toDateInputValue(
      values.watchedAt === "" ? new Date() : new Date(values.watchedAt),
    ),
    score: values.score,
    platform: values.platform,
    releaseYear:
      values.releaseYear === undefined ? "" : String(values.releaseYear),
    runtime: String(values.runtime),
    language: values.language,
    countries: values.countries,
    genres: values.genres,
    credits: toCreditRows(values.credits),
    posterUrl: values.posterUrl,
    moodTags: values.moodTags,
    memo: values.memo,
  };
}

export function applyMovie(
  state: RecordFormState,
  movie: MovieValues,
): RecordFormState {
  return {
    ...state,
    title: movie.title,
    releaseYear:
      movie.releaseYear === undefined ? "" : String(movie.releaseYear),
    runtime: String(movie.runtime),
    genres: movie.genres,
    countries: movie.countries,
    language: movie.language,
    credits: toCreditRows(movie.credits),
    posterUrl: movie.posterUrl,
  };
}

export function toRecordInputValues(state: RecordFormState) {
  return {
    title: state.title,
    watchedAt: startOfLocalDay(state.watchedAt),
    score: state.score ?? "",
    platform: state.platform ?? "",
    releaseYear: state.releaseYear,
    runtime: state.runtime || "0",
    genres: state.genres,
    countries: state.countries,
    language: state.language,
    credits: state.credits
      .map((c) => ({
        personName: c.personName.trim(),
        creditRole: c.creditRole,
      }))
      .filter((c) => c.personName !== ""),
    posterUrl: state.posterUrl.trim(),
    moodTags: state.moodTags,
    memo: state.memo,
  };
}
