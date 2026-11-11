import type { ReactNode } from "react";
import { View } from "react-native";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { Text } from "@/components/atoms/text";
import type { Dictionary } from "@/i18n/get-dictionary";
import { dictMessage } from "@/lib/text/dict-message";

type Failure = Extract<ActionResult<unknown>, { success: false }>;

type AccountFormCardProps = {
  title: string;
  failure: Failure | undefined;
  pending: boolean;
  onSave: () => void;
  dict: Dictionary["account"];
  children: ReactNode;
};

export function AccountFormCard({
  title,
  failure,
  pending,
  onSave,
  dict,
  children,
}: AccountFormCardProps) {
  return (
    <View className="gap-4 rounded-2xl bg-card p-4">
      <Text
        accessibilityRole="header"
        className="font-bold text-[15px] text-foreground"
      >
        {title}
      </Text>
      {failure && !failure.errors && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      {children}
      <View className="flex-row justify-end gap-2 border-secondary border-t pt-3.5">
        <Button className="h-12 flex-1" disabled={pending} onPress={onSave}>
          {dict.save}
        </Button>
      </View>
    </View>
  );
}
