import { Slot } from "expo-router";
import { ScrollView, View } from "react-native";

export default function AuthLayout() {
  return (
    <ScrollView
      className="bg-sidebar"
      contentContainerClassName="flex-grow items-center justify-center px-4 py-10"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
    >
      <View className="shell-inset w-full max-w-111 rounded-[20px] bg-card px-6 py-8">
        <Slot />
      </View>
    </ScrollView>
  );
}
