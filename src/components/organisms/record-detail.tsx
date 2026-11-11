import { CalendarDays, Clock, Languages, MapPin } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import type { ActionResult } from "@/actions/action-result";
import type { AttachmentFile } from "@/actions/record/attachment";
import { GenreTag } from "@/components/atoms/genre-tag";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { MoodTag } from "@/components/atoms/mood-tag";
import { ScoreBadge } from "@/components/atoms/score-badge";
import { SectionLabel } from "@/components/atoms/section-label";
import { Text } from "@/components/atoms/text";
import { EmptyNote } from "@/components/molecules/empty-note";
import { MetaItem } from "@/components/molecules/meta-item";
import { NoteSheet } from "@/components/molecules/note-sheet";
import { PullRefreshControl } from "@/components/molecules/pull-refresh-control";
import { RecordDetailTabs } from "@/components/molecules/record-detail-tabs";
import { RecordPoster } from "@/components/molecules/record-poster";
import { RecordAttachmentSection } from "@/components/organisms/record-attachment-section";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formatDate } from "@/lib/date/format-date";
import { languageName } from "@/lib/record/language-options";
import { regionName } from "@/lib/record/region-names";
import { formatList } from "@/lib/text/format-list";
import { interpolate } from "@/lib/text/interpolate";
import type { Attachment } from "@/schemas/record/attachment";
import type { RecordDetail as RecordDetailData } from "@/schemas/record/record";

type RecordDetailProps = {
  locale: Locale;
  record: RecordDetailData;
  attachments: Attachment[];
  addAttachment?: (file: AttachmentFile) => Promise<ActionResult<null>>;
  deleteAttachment?: (attachmentId: string) => Promise<ActionResult<null>>;
  dict: Dictionary;
  refreshing: boolean;
  onRefresh: () => void;
};

export function RecordDetail({
  locale,
  record,
  attachments,
  addAttachment,
  deleteAttachment,
  dict,
  refreshing,
  onRefresh,
}: RecordDetailProps) {
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

  const watchedCard = (
    <View className="flex-row gap-3">
      <View className="flex-1 gap-2.5">
        <SectionLabel>{d.watchedAt}</SectionLabel>
        <View className="grow rounded-2xl bg-card px-4 py-4">
          <Text className="text-[15px] text-foreground">
            {formatDate(record.watchedAt, locale, "longDate")}
          </Text>
        </View>
      </View>
      <View className="flex-1 gap-2.5">
        <SectionLabel>{d.platform}</SectionLabel>
        <View className="grow rounded-2xl bg-card px-4 py-4">
          <Text className="text-[15px] text-foreground">{platformLabel}</Text>
        </View>
      </View>
    </View>
  );

  const recordTab = (
    <>
      {watchedCard}

      {record.moodTags.length > 0 && (
        <View className="gap-2.5">
          <SectionLabel>{d.moodTags}</SectionLabel>
          <View className="flex-row flex-wrap gap-1.75">
            {record.moodTags.map((mood) => (
              <MoodTag key={mood}>{dict.enums.moodTag[mood]}</MoodTag>
            ))}
          </View>
        </View>
      )}

      <View className="gap-2.5">
        <SectionLabel>{d.note}</SectionLabel>
        {record.note ? (
          <NoteSheet
            content={record.note}
            readMoreLabel={d.noteReadMore}
            showLessLabel={d.noteShowLess}
          />
        ) : (
          <EmptyNote
            text={d.noteEmpty}
            actionLabel={d.noteAdd}
            href={editHref}
          />
        )}
      </View>

      <RecordAttachmentSection
        attachments={attachments}
        add={addAttachment}
        remove={deleteAttachment}
        dict={d}
        deleteDict={dict.deleteAttachment}
      />
    </>
  );

  const movieTab = (
    <>
      {record.originalTitle !== "" && record.originalTitle !== record.title && (
        <View className="gap-2.5">
          <SectionLabel>{d.originalTitle}</SectionLabel>
          <Text className="text-[15px] text-foreground">
            {record.originalTitle}
          </Text>
        </View>
      )}

      <View className="gap-2.5">
        <SectionLabel>{d.overview}</SectionLabel>
        {record.overview !== "" ? (
          <View className="rounded-2xl bg-card px-5.5 py-5">
            <Text className="text-[15px] text-foreground leading-loose">
              {record.overview}
            </Text>
          </View>
        ) : (
          <EmptyNote
            text={d.overviewEmpty}
            actionLabel={d.overviewAdd}
            href={editHref}
          />
        )}
      </View>

      {record.genres.length > 0 && (
        <View className="gap-2.5">
          <SectionLabel>{dict.recordForm.genres}</SectionLabel>
          <View className="flex-row flex-wrap gap-1.75">
            {record.genres.map((genre) => (
              <GenreTag key={genre}>{dict.enums.genre[genre]}</GenreTag>
            ))}
          </View>
        </View>
      )}

      <View className="gap-3">
        <SectionLabel>{d.credits}</SectionLabel>
        {record.credits.length > 0 ? (
          <View className="gap-2.5 rounded-2xl bg-card px-5.5 py-5">
            {record.credits.map((credit, index) => (
              <View
                key={`${credit.creditRole}-${credit.personName}-${index}`}
                className="flex-row flex-wrap items-baseline justify-between gap-x-3 border-border border-b border-dashed pb-2.25"
              >
                <Text className="shrink-0 text-muted-foreground text-xs">
                  {dict.enums.creditRole[credit.creditRole]}
                </Text>
                <Text className="ml-auto min-w-0 text-right text-foreground text-sm">
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
    </>
  );

  return (
    <ScrollView
      contentContainerClassName="gap-6 px-4 pt-5 pb-10"
      refreshControl={
        <PullRefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="flex-row gap-4">
        <View className="relative w-29 shrink-0 self-start pt-1.5">
          <View
            className="rounded-[3px]"
            style={{ boxShadow: "0 10px 24px -12px rgba(10, 41, 71, 0.55)" }}
          >
            <RecordPoster
              posterUrl={record.posterUrl}
              noPosterLabel={dict.recordCard.noPoster}
              className="rounded-[3px]"
            />
          </View>
          <MaskingTape className="top-0" tapeClassName="h-3.5 w-11" />
        </View>
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

      <RecordDetailTabs
        tabs={[
          { value: "record", label: d.tabRecord, content: recordTab },
          { value: "movie", label: d.tabMovie, content: movieTab },
        ]}
      />
    </ScrollView>
  );
}
