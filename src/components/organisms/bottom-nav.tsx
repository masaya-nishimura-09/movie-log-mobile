import type Tabs from "expo-router/js-tabs";
import {
  LayoutGrid,
  type LucideIcon,
  Plus,
  UserRound,
} from "lucide-react-native";
import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { Edged } from "@/components/atoms/edged";
import { Icon } from "@/components/atoms/icon";
import { SafeAreaView } from "@/components/atoms/safe-area-view";
import { Text } from "@/components/atoms/text";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";

type TabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

type TabName = "records" | "new" | "account";

type NavTabProps = {
  label: string;
  icon: LucideIcon;
  active: boolean;
  onPress: () => void;
};

function NavTab({ label, icon, active, onPress }: NavTabProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className="flex-1 items-center justify-center gap-1"
    >
      <Icon
        icon={icon}
        size={22}
        className={active ? "text-accent-foreground" : "text-muted-foreground"}
      />
      <Text
        className={cn(
          "font-medium text-[11px]",
          active ? "text-accent-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type BottomNavProps = TabBarProps & {
  dict: Dictionary["bottomNav"];
};

export function BottomNav({ state, navigation, dict }: BottomNavProps) {
  const activeName = state.routes[state.index]?.name;

  const go = (name: TabName) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (activeName !== name && !event.defaultPrevented) {
      navigation.navigate(name);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="bg-sidebar">
      <View className="h-17 flex-row items-center px-2">
        <NavTab
          label={dict.records}
          icon={LayoutGrid}
          active={activeName === "records"}
          onPress={() => go("records")}
        />
        <Edged
          accessibilityRole="button"
          onPress={() => go("new")}
          edge="--primary-edge"
          rounded="rounded-full"
          contentClassName="h-11.5 flex-row items-center gap-1.5 bg-primary px-5"
        >
          <Icon icon={Plus} size={18} className="text-primary-foreground" />
          <Text className="font-bold text-primary-foreground text-sm">
            {dict.newRecord}
          </Text>
        </Edged>
        <NavTab
          label={dict.account}
          icon={UserRound}
          active={activeName === "account"}
          onPress={() => go("account")}
        />
      </View>
    </SafeAreaView>
  );
}
