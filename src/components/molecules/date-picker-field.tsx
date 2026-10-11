import { CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Pressable } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import { Calendar } from "@/components/molecules/calendar";
import { Sheet } from "@/components/molecules/sheet";
import type { Locale } from "@/i18n/locales";
import { dateStyles, toDateInputValue } from "@/lib/date/format-date";
import { parseDateInput } from "@/lib/date/parse-date-input";

type DatePickerFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  locale: Locale;
  label: string;
  closeLabel: string;
};

export function DatePickerField({
  value,
  onValueChange,
  locale,
  label,
  closeLabel,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = value === "" ? undefined : parseDateInput(value);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        className="h-11 w-full flex-row items-center justify-between gap-2 rounded-lg bg-field px-3.5"
      >
        <Text className="font-medium text-[15px] text-foreground">
          {selected &&
            new Intl.DateTimeFormat(locale, dateStyles.longDate).format(
              selected,
            )}
        </Text>
        <Icon icon={CalendarDays} size={16} className="text-muted-foreground" />
      </Pressable>
      <Sheet
        visible={open}
        onClose={() => setOpen(false)}
        title={label}
        closeLabel={closeLabel}
      >
        <Calendar
          selected={selected}
          maxDate={new Date()}
          locale={locale}
          onSelect={(date) => {
            onValueChange(toDateInputValue(date));
            setOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}
