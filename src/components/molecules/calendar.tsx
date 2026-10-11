import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import type { Locale } from "@/i18n/locales";
import { cn } from "@/lib/style/cn";

type CalendarProps = {
  selected: Date | undefined;
  onSelect: (date: Date) => void;
  maxDate?: Date;
  locale: Locale;
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function weeksOf(month: Date) {
  const first = startOfMonth(month);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const start = addDays(first, -first.getDay());
  const end = addDays(last, 6 - last.getDay());
  const weeks: Date[][] = [];
  for (let day = start; day <= end; day = addDays(day, 7)) {
    weeks.push(Array.from({ length: 7 }, (_, index) => addDays(day, index)));
  }
  return weeks;
}

function weekdayNames(locale: Locale) {
  const format = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const sunday = new Date(2026, 0, 4);
  return Array.from({ length: 7 }, (_, index) => {
    const name = format.format(addDays(sunday, index));
    return locale === "en" ? name.slice(0, 2) : name;
  });
}

export function Calendar({
  selected,
  onSelect,
  maxDate,
  locale,
}: CalendarProps) {
  const [month, setMonth] = useState(startOfMonth(selected ?? new Date()));
  const today = new Date();
  const caption = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(month);
  const shiftMonth = (amount: number) =>
    setMonth(new Date(month.getFullYear(), month.getMonth() + amount, 1));

  return (
    <View className="self-center p-2">
      <View className="h-9 flex-row items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          icon={ChevronLeft}
          onPress={() => shiftMonth(-1)}
          className="size-9 px-0"
        />
        <Text className="font-bold text-foreground text-sm">{caption}</Text>
        <Button
          variant="ghost"
          size="icon"
          icon={ChevronRight}
          onPress={() => shiftMonth(1)}
          className="size-9 px-0"
        />
      </View>
      <View className="mt-4 flex-row">
        {weekdayNames(locale).map((name) => (
          <Text
            key={name}
            className="w-9 text-center text-[12.8px] text-muted-foreground"
          >
            {name}
          </Text>
        ))}
      </View>
      {weeksOf(month).map((week) => (
        <View key={week[0]?.toISOString()} className="mt-2 flex-row">
          {week.map((day) => {
            const isSelected =
              selected !== undefined && isSameDay(day, selected);
            const isToday = isSameDay(day, today);
            const isDisabled = maxDate !== undefined && day > maxDate;
            return (
              <Pressable
                key={day.toISOString()}
                accessibilityRole="button"
                accessibilityState={{
                  selected: isSelected,
                  disabled: isDisabled,
                }}
                disabled={isDisabled}
                onPress={() => onSelect(day)}
                className={cn(
                  "size-9 items-center justify-center rounded-md active:bg-secondary",
                  isToday && "bg-muted",
                  isSelected && "bg-selected",
                  isDisabled && "opacity-50",
                )}
              >
                <Text
                  className={cn(
                    "font-medium text-foreground-sub text-sm",
                    isSelected && "text-selected-foreground",
                  )}
                >
                  {day.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}
