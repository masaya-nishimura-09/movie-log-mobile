import { type Href, Link, router, useGlobalSearchParams } from "expo-router";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Logo } from "@/components/atoms/logo";
import { SafeAreaView } from "@/components/atoms/safe-area-view";
import { SearchForm } from "@/components/molecules/search-form";
import { ThemeToggle } from "@/components/molecules/theme-toggle";
import { AccountMenu } from "@/components/organisms/account-menu";
import type { Dictionary } from "@/i18n/get-dictionary";
import { recordQueryKeys } from "@/lib/record/parse-record-query";
import { buildHref } from "@/lib/url/build-href";

type AppTopBarProps = {
  brandName: string;
  username: string;
  dict: Dictionary["header"];
};

export function AppTopBar({ brandName, username, dict }: AppTopBarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const params = useGlobalSearchParams();
  const keyword =
    typeof params[recordQueryKeys.keyword] === "string"
      ? String(params[recordQueryKeys.keyword])
      : "";

  const search = (value: string) => {
    router.navigate(
      buildHref("/records", { [recordQueryKeys.keyword]: value }) as Href,
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="bg-sidebar">
      <View className="h-15 flex-row items-center gap-2 px-3">
        <Link href="/records" asChild>
          <Pressable accessibilityRole="link">
            <Logo name={brandName} />
          </Pressable>
        </Link>
        <View className="ml-auto flex-row items-center gap-1.5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={dict.openSearch}
            onPress={() => setSearchOpen((open) => !open)}
            className="size-9 items-center justify-center rounded-full active:bg-sidebar-accent"
          >
            <Icon icon={Search} size={20} className="text-foreground-sub" />
          </Pressable>
          <ThemeToggle label={dict.themeToggle} />
          <AccountMenu username={username} dict={dict} />
        </View>
      </View>
      {searchOpen && (
        <View className="px-3 pb-3">
          <SearchForm
            label={dict.searchLabel}
            placeholder={dict.searchPlaceholder}
            keyword={keyword}
            onSubmit={search}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
