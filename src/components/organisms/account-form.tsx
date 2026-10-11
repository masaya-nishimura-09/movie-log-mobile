import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { updateAccountAction } from "@/actions/user/update-account";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Text } from "@/components/atoms/text";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import { useToast } from "@/components/molecules/toaster";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { User } from "@/schemas/user/user";

type AccountFormProps = {
  user: User;
  dict: Dictionary["account"];
  passwordDict: Dictionary["passwordInput"];
  counterTemplate: string;
};

export function AccountForm({
  user,
  dict,
  passwordDict,
  counterTemplate,
}: AccountFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const { mutate, data, isPending } = useMutation({
    mutationFn: updateAccountAction,
    onSuccess: async (result) => {
      if (!result.success) return;
      setPassword("");
      toast(dict.saved);
      if (!result.data.loggedIn) {
        queryClient.clear();
        router.replace("/login");
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  const failure = data?.success === false ? data : undefined;
  const message = (key: string) =>
    key in dict ? dict[key as keyof typeof dict] : dict.unexpectedError;

  useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
  }, [user]);

  return (
    <View className="gap-4 rounded-2xl bg-card p-4">
      {failure && !failure.errors && (
        <Text
          accessibilityRole="alert"
          className="rounded-lg bg-destructive-soft px-3.5 py-2.5 text-destructive-foreground text-sm"
        >
          {message(failure.messageKey)}
        </Text>
      )}
      <FormField
        label={dict.username}
        error={failure?.errors?.username && dict.usernameError}
      >
        <CountedInput
          value={username}
          onChangeText={setUsername}
          maxLength={100}
          counterTemplate={counterTemplate}
          invalid={Boolean(failure?.errors?.username)}
        />
      </FormField>
      <FormField
        label={dict.email}
        error={failure?.errors?.email && dict.emailError}
      >
        <Input
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          invalid={Boolean(failure?.errors?.email)}
        />
      </FormField>
      <FormField
        label={dict.password}
        hint={dict.passwordHint}
        error={failure?.errors?.password && dict.passwordError}
      >
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoComplete="new-password"
          autoCorrect={false}
          maxLength={72}
          invalid={Boolean(failure?.errors?.password)}
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
      <View className="flex-row justify-end gap-2 border-secondary border-t pt-3.5">
        <Button
          className="h-12 flex-1"
          disabled={isPending}
          onPress={() => mutate({ username, email, password })}
        >
          {dict.save}
        </Button>
      </View>
    </View>
  );
}
