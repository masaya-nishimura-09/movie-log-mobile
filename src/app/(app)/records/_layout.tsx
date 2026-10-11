import { Stack } from "expo-router";
import { Inset } from "@/components/atoms/inset";

export const unstable_settings = { initialRouteName: "index" };

export default function RecordsLayout() {
  return (
    <Inset>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </Inset>
  );
}
