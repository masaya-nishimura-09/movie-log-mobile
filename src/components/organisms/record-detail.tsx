import { type Href, Link } from "expo-router";
import {
  CalendarDays,
  Clock,
  Languages,
  type LucideIcon,
  MapPin,
} from "lucide-react-native";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { GenreTag } from "@/components/atoms/genre-tag";
import { Icon } from "@/components/atoms/icon";
import { MoodTag } from "@/components/atoms/mood-tag";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { Text } from "@/components/atoms/text";
import { RecordPoster } from "@/components/molecules/record-poster";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formatDate } from "@/lib/date/format-date";
import { languageName } from "@/lib/record/language-options";
import { regionName } from "@/lib/record/region-names";
import { formatList } from "@/lib/text/format-list";
import { interpolate } from "@/lib/text/interpolate";
import type { MovieRecord } from "@/schemas/record/record";

type RecordDetailProps = {
  locale: Locale;
  record: MovieRecord;
  dict: Dictionary;
};

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <Text className="font-bold text-muted-foreground text-xs tracking-[0.08em]">
      {children}
    </Text>
  );
}

function EmptyNote({
  text,
  actionLabel,
  href,
}: {
  text: string;
  actionLabel: string;
  href: string;
}) {
  return (
    <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border border-border border-dashed px-5.5 py-5">
      <Text className="text-[15px] text-muted-foreground">{text}</Text>
      <Link href={href as Href}>
        <Text className="font-medium text-[15px] text-primary">
          {actionLabel}
        </Text>
      </Link>
    </View>
  );
}

function MetaItem({
  icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      className="shrink flex-row items-start gap-1"
    >
      <View className="h-[21px] justify-center">
        <Icon icon={icon} size={13} className="text-muted-foreground" />
      </View>
      <Text className="shrink text-[13px] text-foreground-sub leading-relaxed">
        {value}
      </Text>
    </View>
  );
}

export function RecordDetail({ locale, record, dict }: RecordDetailProps) {
  const d = dict.recordDetail;
  const year =
    record.releaseYear > 0
      ? interpolate(d.releaseYear, { year: record.releaseYear })
      : "";
  const runtime =
    record.runtime > 0
      ? interpolate(d.runtime, { minutes: record.runtime })
      : "";
  const language = languageName(
    locale,
    record.language,
    dict.recordForm.languageUnknown,
  );
  const countries = formatList(
    locale,
    record.countries.map((code) => regionName(locale, code)),
  );
  const meta = [
    {
      key: "year",
      icon: CalendarDays,
      label: dict.recordForm.releaseYear,
      value: year,
    },
    {
      key: "runtime",
      icon: Clock,
      label: dict.recordForm.runtime,
      value: runtime,
    },
    {
      key: "countries",
      icon: MapPin,
      label: dict.recordForm.countries,
      value: countries,
    },
    {
      key: "language",
      icon: Languages,
      label: dict.recordForm.language,
      value: language,
    },
  ].filter((item) => item.value !== "");
  const platformLabel = dict.enums.platform[record.platform];
  const scoreLabel = interpolate(dict.recordCard.score, {
    score: record.score,
  });
  const editHref = `/records/${record.recordId}/edit`;

  return (
    <ScrollView contentContainerClassName="gap-6 px-4 pt-5 pb-10">
      <View className="flex-row gap-4">
        <RecordPoster
          title={record.title}
          posterUrl={record.posterUrl}
          year={record.releaseYear > 0 ? String(record.releaseYear) : ""}
          platformLabel={platformLabel}
          size="detail"
          className="w-29 shrink-0 rounded-xl"
        />
        <View className="min-w-0 flex-1 gap-3">
          <ScoreBadge
            score={record.score}
            size="md"
            label={scoreLabel}
            caption={d.scoreCaption}
          />
          <Text className="font-bold text-foreground text-xl leading-[1.35]">
            {record.title}
          </Text>
          <View className="flex-row flex-wrap gap-x-3 gap-y-1">
            {meta.map((item) => (
              <MetaItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                value={item.value}
              />
            ))}
          </View>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-1.75">
        {record.genres.map((genre) => (
          <GenreTag key={genre}>{dict.enums.genre[genre]}</GenreTag>
        ))}
        {record.moodTags.map((mood) => (
          <MoodTag key={mood}>{dict.enums.moodTag[mood]}</MoodTag>
        ))}
      </View>

      <View className="flex-row gap-3">
        <View className="flex-1 gap-2.5">
          <SectionLabel>{d.watchedAt}</SectionLabel>
          <View className="flex-1 rounded-2xl bg-card px-4 py-4">
            <Text className="text-[15px] text-foreground">
              {formatDate(record.watchedAt, locale, "longDate")}
            </Text>
          </View>
        </View>
        <View className="flex-1 gap-2.5">
          <SectionLabel>{d.platform}</SectionLabel>
          <View className="flex-1 rounded-2xl bg-card px-4 py-4">
            <Text className="text-[15px] text-foreground">{platformLabel}</Text>
          </View>
        </View>
      </View>

      <View className="gap-2.5">
        <SectionLabel>{d.memo}</SectionLabel>
        {record.memo !== "" ? (
          <View className="rounded-2xl bg-card px-5.5 py-5">
            <Text className="text-[15px] text-foreground leading-loose">
              {record.memo}
            </Text>
          </View>
        ) : (
          <EmptyNote
            text={d.memoEmpty}
            actionLabel={d.memoAdd}
            href={editHref}
          />
        )}
      </View>

      <View className="gap-3">
        <SectionLabel>{d.credits}</SectionLabel>
        {record.credits.length > 0 ? (
          <View className="gap-2.5">
            {record.credits.map((credit, index) => (
              <View
                key={`${credit.creditRole}-${credit.personName}-${index}`}
                className="flex-row items-baseline justify-between gap-3 border-border border-b border-dashed pb-2.25"
              >
                <Text className="shrink-0 text-muted-foreground text-xs">
                  {dict.enums.creditRole[credit.creditRole]}
                </Text>
                <Text className="min-w-0 flex-1 text-right text-foreground text-sm">
                  {credit.personName}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyNote
            text={d.creditsEmpty}
            actionLabel={d.creditsAdd}
            href={editHref}
          />
        )}
      </View>

      <View className="gap-1">
        <Text className="text-muted-foreground text-xs">
          {d.createdAt} {formatDate(record.createdAt, locale, "dateTime")}
        </Text>
        <Text className="text-muted-foreground text-xs">
          {d.updatedAt} {formatDate(record.updatedAt, locale, "dateTime")}
        </Text>
      </View>
    </ScrollView>
  );
}
