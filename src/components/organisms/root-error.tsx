import type { ErrorBoundaryProps } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { Button } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import { useI18n } from "@/i18n/use-i18n";

export function RootError({ error, retry }: ErrorBoundaryProps) {
  const { dict } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <View className="shell flex-1 items-center justify-center bg-sidebar px-4 py-10">
      <StatusBar style="light" />
      <View className="shell-inset w-full items-center">
        <EmptyState
          title={dict.errorPage.title}
          description={dict.errorPage.description}
          action={
            <Button onPress={() => void retry()}>{dict.errorPage.retry}</Button>
          }
        />
      </View>
    </View>
  );
}
