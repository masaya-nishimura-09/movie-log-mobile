import { X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Input } from "@/components/atoms/input";
import { Text } from "@/components/atoms/text";
import type { Locale } from "@/i18n/locales";
import { regionName } from "@/lib/record/region-names";
import { interpolate } from "@/lib/text/interpolate";

type CountryInputProps = {
  locale: Locale;
  codes: string[];
  onChange: (codes: string[]) => void;
  placeholder: string;
  removeTemplate: string;
};

export function CountryInput({
  locale,
  codes,
  onChange,
  placeholder,
  removeTemplate,
}: CountryInputProps) {
  const [text, setText] = useState("");

  const add = () => {
    const code = text.trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(code) || codes.includes(code)) return;
    onChange([...codes, code]);
    setText("");
  };

  return (
    <View className="gap-2">
      {codes.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5">
          {codes.map((code) => {
            const label = regionName(locale, code);
            return (
              <View
                key={code}
                className="h-8 flex-row items-center gap-1 rounded-md bg-secondary pr-1 pl-2.5"
              >
                <Text className="text-foreground text-sm">{label}</Text>
                <Text className="text-muted-foreground text-xs">{code}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={interpolate(removeTemplate, {
                    name: label,
                  })}
                  onPress={() => onChange(codes.filter((c) => c !== code))}
                  className="size-6 items-center justify-center"
                >
                  <Icon icon={X} size={14} className="text-muted-foreground" />
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
      <Input
        value={text}
        onChangeText={setText}
        onSubmitEditing={add}
        placeholder={placeholder}
        maxLength={2}
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="done"
      />
    </View>
  );
}
