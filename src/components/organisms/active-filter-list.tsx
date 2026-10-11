import { type Href, Link } from "expo-router";
import { X } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import type { Dictionary } from "@/i18n/get-dictionary";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { interpolate } from "@/lib/text/interpolate";
import {
  buildHref,
  type QueryValues,
  selectValue,
  toggleValue,
} from "@/lib/url/build-href";
import type { RecordQuery } from "@/schemas/record/list";

type ActiveFilterListProps = {
  basePath: string;
  query: RecordQuery;
  values: QueryValues;
  clearHref: string;
  dict: Dictionary["recordFilter"];
  enums: Dictionary["enums"];
};

export function ActiveFilterList({
  basePath,
  query,
  values,
  clearHref,
  dict,
  enums,
}: ActiveFilterListProps) {
  const toggle = (key: string, value: string) =>
    buildHref(basePath, toggleValue(values, key, value));
  const items = [
    ...(query.keyword === ""
      ? []
      : [
          {
            label: `"${query.keyword}"`,
            href: buildHref(basePath, {
              ...values,
              [recordQueryKeys.keyword]: undefined,
              [recordQueryKeys.page]: undefined,
            }),
          },
        ]),
    ...(query.score === undefined
      ? []
      : [
          {
            label: `${dict.score} ${query.score}`,
            href: buildHref(
              basePath,
              selectValue(values, recordQueryKeys.score, String(query.score)),
            ),
          },
        ]),
    ...(query.platform === undefined
      ? []
      : [
          {
            label: enums.platform[query.platform],
            href: buildHref(
              basePath,
              selectValue(values, recordQueryKeys.platform, query.platform),
            ),
          },
        ]),
    ...query.moodTags.map((mood) => ({
      label: enums.moodTag[mood],
      href: toggle(recordQueryKeys.moodTag, mood),
    })),
    ...query.genres.map((genre) => ({
      label: enums.genre[genre],
      href: toggle(recordQueryKeys.genre, genre),
    })),
  ];

  if (items.length === 0) return null;

  return (
    <View className="flex-row flex-wrap items-center justify-end gap-1.5">
      {items.map((item) => (
        <Link key={item.href} href={item.href as Href} replace asChild>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={interpolate(dict.remove, { label: item.label })}
            className="h-8 flex-row items-center gap-1.5 rounded-full bg-selected px-2.75"
          >
            <Text className="font-medium text-selected-foreground text-xs">
              {item.label}
            </Text>
            <Icon icon={X} size={15} className="text-selected-foreground" />
          </Pressable>
        </Link>
      ))}
      <Link href={clearHref as Href} replace asChild>
        <Pressable accessibilityRole="button" className="px-1.5 py-1.5">
          <Text className="font-medium text-muted-foreground text-xs">
            {dict.clearAll}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
