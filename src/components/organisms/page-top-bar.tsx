import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

type PageTopBarProps = {
  backHref?: string;
  backLabel?: string;
  title?: string;
  actions?: ReactNode;
};

export function PageTopBar({
  backHref,
  backLabel,
  title,
  actions,
}: PageTopBarProps) {
  const router = useRouter();
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else if (backHref) router.replace(backHref as never);
  };

  return (
    <View className="h-14 flex-row items-center gap-3.5 rounded-t-2xl border-border border-b bg-background px-4">
      {backHref && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          onPress={goBack}
          className="-ml-1 p-1"
        >
          <Icon icon={ArrowLeft} size={21} className="text-foreground-sub" />
        </Pressable>
      )}
      {title && (
        <Text className="font-bold text-[17px] text-foreground">{title}</Text>
      )}
      {actions && (
        <View className="ml-auto flex-row items-center gap-2">{actions}</View>
      )}
    </View>
  );
}
