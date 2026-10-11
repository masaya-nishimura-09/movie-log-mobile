import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Input } from "@/components/atoms/input";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "secureTextEntry"
> & {
  showLabel: string;
  hideLabel: string;
};

export function PasswordInput({
  showLabel,
  hideLabel,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View className="relative">
      <Input secureTextEntry={!visible} className="pr-11" {...props} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={visible ? hideLabel : showLabel}
        onPress={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-0 w-11 items-center justify-center"
      >
        <Icon
          icon={visible ? EyeOff : Eye}
          size={16}
          className="text-muted-foreground"
        />
      </Pressable>
    </View>
  );
}
