import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert, View } from "react-native";
import { withdrawAction } from "@/actions/user/withdraw";
import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import type { Dictionary } from "@/i18n/get-dictionary";

type WithdrawSectionProps = {
  dict: Dictionary["account"];
};

export function WithdrawSection({ dict }: WithdrawSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: withdrawAction,
    onSuccess: (result) => {
      if (!result.success) {
        Alert.alert(dict.withdrawFailed);
        return;
      }
      queryClient.clear();
      router.replace("/register");
    },
  });

  const confirm = () => {
    Alert.alert(dict.withdrawConfirmTitle, dict.withdrawDescription, [
      { text: dict.withdrawCancel, style: "cancel" },
      {
        text: dict.withdrawConfirm,
        style: "destructive",
        onPress: () => mutate(),
      },
    ]);
  };

  return (
    <View className="items-start gap-2 rounded-2xl bg-card px-4 py-4.5">
      <Text className="font-bold text-[15px] text-destructive-foreground">
        {dict.withdrawTitle}
      </Text>
      <Text className="text-[13px] text-foreground-sub">
        {dict.withdrawDescription}
      </Text>
      <Button
        variant="destructive"
        size="sm"
        disabled={isPending}
        onPress={confirm}
        className="mt-2"
      >
        {dict.withdrawAction}
      </Button>
    </View>
  );
}
