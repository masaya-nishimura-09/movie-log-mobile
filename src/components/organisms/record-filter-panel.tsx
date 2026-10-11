import { type ReactNode, useState } from "react";
import { Pressable, View } from "react-native";
import { SectionLabel } from "@/components/atoms/section-label";
import { Text } from "@/components/atoms/text";
import { FilterChipLink } from "@/components/molecules/filter-chip-link";
import { FilterRadioLink } from "@/components/molecules/filter-radio-link";
import { SortSelect } from "@/components/molecules/sort-select";
import type { Dictionary } from "@/i18n/get-dictionary";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { interpolate } from "@/lib/text/interpolate";
import {
  buildHref,
  type QueryValues,
  selectValue,
  toggleValue,
} from "@/lib/url/build-href";
import {
  genreSchema,
  moodTagSchema,
  platformSchema,
  scores,
} from "@/schemas/record/enums";
import { type RecordQuery, recordSorts } from "@/schemas/record/list";

type RecordFilterPanelProps = {
  basePath: string;
  query: RecordQuery;
  values: QueryValues;
  dict: Dictionary["recordFilter"];
  sortDict: Dictionary["recordSort"];
  enums: Dictionary["enums"];
  closeLabel: string;
};

const visiblePlatformCount = 6;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2.25">
      <SectionLabel>{title}</SectionLabel>
      {children}
    </View>
  );
}

type FilterOptionsProps = Omit<
  RecordFilterPanelProps,
  "dict" | "sortDict" | "closeLabel"
>;

function toggleHrefFor(basePath: string, values: QueryValues) {
  return (key: string, value: string) =>
    buildHref(basePath, toggleValue(values, key, value));
}

function selectHrefFor(basePath: string, values: QueryValues) {
  return (key: string, value: string) =>
    buildHref(basePath, selectValue(values, key, value));
}

function SortOptions({
  basePath,
  query,
  values,
  sortDict,
  closeLabel,
  className,
}: Omit<FilterOptionsProps, "enums"> & {
  sortDict: Dictionary["recordSort"];
  closeLabel: string;
  className?: string;
}) {
  return (
    <SortSelect
      className={className}
      label={sortDict.label}
      closeLabel={closeLabel}
      value={query.sort}
      options={recordSorts.map((sort) => ({
        value: sort,
        label: sortDict[sort],
        href: buildHref(basePath, {
          ...values,
          [recordQueryKeys.sort]: sort === "watchedAtDesc" ? undefined : sort,
          [recordQueryKeys.page]: undefined,
        }),
      }))}
    />
  );
}

function ScoreOptions({ basePath, query, values }: FilterOptionsProps) {
  const selectHref = selectHrefFor(basePath, values);
  return (
    <View className="flex-row gap-1.5">
      {[...scores].reverse().map((score) => (
        <FilterChipLink
          key={score}
          shape="block"
          size="sm"
          href={selectHref(recordQueryKeys.score, String(score))}
          active={query.score === score}
          className="h-9 rounded-[10px]"
          labelClassName="text-[13px] text-foreground-sub"
        >
          {String(score)}
        </FilterChipLink>
      ))}
    </View>
  );
}

function PlatformOptions({
  basePath,
  query,
  values,
  enums,
  showAllLabel,
}: FilterOptionsProps & { showAllLabel: string }) {
  const platforms = platformSchema.options;
  const [expanded, setExpanded] = useState(
    query.platform !== undefined &&
      platforms.indexOf(query.platform) >= visiblePlatformCount,
  );
  const selectHref = selectHrefFor(basePath, values);
  const shown = expanded ? platforms : platforms.slice(0, visiblePlatformCount);

  return (
    <View accessibilityRole="radiogroup" className="gap-2">
      {shown.map((platform) => (
        <FilterRadioLink
          key={platform}
          href={selectHref(recordQueryKeys.platform, platform)}
          active={query.platform === platform}
          label={enums.platform[platform]}
        />
      ))}
      {!expanded && (
        <Pressable
          accessibilityRole="button"
          onPress={() => setExpanded(true)}
          className="mt-0.5 py-1"
        >
          <Text className="font-medium text-primary text-xs">
            {showAllLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function MoodOptions({ basePath, query, values, enums }: FilterOptionsProps) {
  const toggleHref = toggleHrefFor(basePath, values);
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {moodTagSchema.options.map((mood) => (
        <FilterChipLink
          key={mood}
          size="sm"
          tone="mood"
          href={toggleHref(recordQueryKeys.moodTag, mood)}
          active={query.moodTags.includes(mood)}
        >
          {enums.moodTag[mood]}
        </FilterChipLink>
      ))}
    </View>
  );
}

function GenreOptions({ basePath, query, values, enums }: FilterOptionsProps) {
  const toggleHref = toggleHrefFor(basePath, values);
  return (
    <View className="flex-row flex-wrap gap-1.5">
      {genreSchema.options.map((genre) => (
        <FilterChipLink
          key={genre}
          shape="square"
          size="sm"
          tone="genre"
          href={toggleHref(recordQueryKeys.genre, genre)}
          active={query.genres.includes(genre)}
        >
          {enums.genre[genre]}
        </FilterChipLink>
      ))}
    </View>
  );
}

export function RecordFilterPanel({
  dict,
  sortDict,
  closeLabel,
  ...props
}: RecordFilterPanelProps) {
  return (
    <View className="gap-8">
      <Section title={sortDict.label}>
        <SortOptions {...props} sortDict={sortDict} closeLabel={closeLabel} />
      </Section>
      <Section title={dict.score}>
        <ScoreOptions {...props} />
      </Section>
      <Section title={dict.platform}>
        <PlatformOptions
          {...props}
          showAllLabel={interpolate(dict.showAllPlatforms, {
            count: platformSchema.options.length,
          })}
        />
      </Section>
      <Section title={dict.moodTag}>
        <MoodOptions {...props} />
      </Section>
      <Section title={dict.genre}>
        <GenreOptions {...props} />
      </Section>
    </View>
  );
}
