import {
  focusManager,
  MutationCache,
  onlineManager,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { router } from "expo-router";
import { AppState, type AppStateStatus, Platform } from "react-native";
import { ApiError } from "@/api/client/api-error";

const authErrorCodes: ApiError["code"][] = [
  "UNAUTHENTICATED",
  "INVALID_ACCESS_TOKEN",
  "INVALID_REFRESH_TOKEN",
];

function redirectIfUnauthenticated(error: Error) {
  if (error instanceof ApiError && authErrorCodes.includes(error.code)) {
    queryClient.clear();
    router.replace("/login");
  }
}

export const queryClient: QueryClient = new QueryClient({
  queryCache: new QueryCache({ onError: redirectIfUnauthenticated }),
  mutationCache: new MutationCache({ onError: redirectIfUnauthenticated }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        !(error instanceof ApiError) && failureCount < 2,
    },
  },
});

onlineManager.setEventListener((setOnline) => {
  const subscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return subscription.remove;
});

export function subscribeAppFocus(): () => void {
  const onChange = (status: AppStateStatus) => {
    if (Platform.OS !== "web") focusManager.setFocused(status === "active");
  };
  const subscription = AppState.addEventListener("change", onChange);
  return () => subscription.remove();
}
