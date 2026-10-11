import { Redirect } from "expo-router";
import Tabs from "expo-router/js-tabs";
import { View } from "react-native";
import { AppTopBar } from "@/components/organisms/app-top-bar";
import { BottomNav } from "@/components/organisms/bottom-nav";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSession } from "@/hooks/use-session";
import { useI18n } from "@/i18n/use-i18n";

export default function AppLayout() {
  const session = useSession();
  const { dict } = useI18n();
  const { data: user } = useCurrentUser(session === "authenticated");

  if (session === "loading") return null;
  if (session === "unauthenticated") return <Redirect href="/login" />;

  return (
    <View className="flex-1 bg-sidebar">
      <AppTopBar
        brandName={dict.brand.name}
        username={user?.username ?? ""}
        dict={dict.header}
      />
      <View className="flex-1">
        <Tabs
          tabBar={(props) => <BottomNav {...props} dict={dict.bottomNav} />}
          screenOptions={{
            headerShown: false,
            sceneStyle: { backgroundColor: "transparent" },
          }}
        >
          <Tabs.Screen name="records" />
          <Tabs.Screen name="new" />
          <Tabs.Screen name="account" />
        </Tabs>
      </View>
    </View>
  );
}
