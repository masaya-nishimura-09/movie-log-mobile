import { useCallback, useState } from "react";
import {
  getMovieAction,
  searchMoviesAction,
} from "@/actions/movie/movie-assist";
import type { Locale } from "@/i18n/locales";
import {
  applyMovie,
  type RecordFormState,
  toFormState,
} from "@/lib/record/record-form-state";
import type { RecordFormValues } from "@/schemas/record/record-form";

export function useRecordForm(initial: RecordFormValues, locale: Locale) {
  const [form, setForm] = useState<RecordFormState>(() => toFormState(initial));

  const update = useCallback((patch: Partial<RecordFormState>) => {
    setForm((current) => ({ ...current, ...patch }));
  }, []);

  const selectMovie = useCallback(
    async (movieId: string) => {
      const movie = await getMovieAction(locale, movieId);
      if (movie) setForm((current) => applyMovie(current, movie));
    },
    [locale],
  );

  const searchMovies = useCallback(
    (title: string) => searchMoviesAction(locale, title),
    [locale],
  );

  return { form, update, selectMovie, searchMovies };
}
