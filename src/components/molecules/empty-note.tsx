import { type Href, Link } from "expo-router";
import { View } from "react-native";
import { Text } from "@/components/atoms/text";

type EmptyNoteProps = {
  text: string;
  actionLabel: string;
  href: string;
};

export function EmptyNote({ text, actionLabel, href }: EmptyNoteProps) {
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
