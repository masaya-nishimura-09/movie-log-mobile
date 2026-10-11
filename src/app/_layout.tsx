import "../../global.css";

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { colorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import { ToastProvider } from "@/components/molecules/toaster";
import { queryClient, subscribeAppFocus } from "@/lib/query/query-client";
import { loadScheme } from "@/lib/theme/theme-storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  useEffect(subscribeAppFocus, []);

  useEffect(() => {
    loadScheme().then((scheme) => {
      if (scheme) colorScheme.set(scheme);
    });
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) void SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <View className="shell flex-1 bg-sidebar">
        <StatusBar style="light" />
        <ToastProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
        </ToastProvider>
      </View>
    </QueryClientProvider>
  );
}
