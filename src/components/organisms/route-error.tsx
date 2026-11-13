import type { ErrorBoundaryProps } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { ErrorState } from "@/components/molecules/error-state";
import { useI18n } from "@/i18n/use-i18n";

export function RouteError({ error, retry }: ErrorBoundaryProps) {
  const { dict } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <View className="flex-1 bg-background">
      <ErrorState dict={dict.errorPage} onRetry={() => void retry()} />
    </View>
  );
}
