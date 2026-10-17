import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { loginAction } from "@/actions/auth/login";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Text } from "@/components/atoms/text";
import { TextLink } from "@/components/atoms/text-link";
import { FormAlert } from "@/components/molecules/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import { dictMessage } from "@/lib/text/dict-message";

type LoginFormProps = {
  dict: Dictionary["login"];
  passwordDict: Dictionary["passwordInput"];
};

export function LoginForm({ dict, passwordDict }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate, data, isPending } = useMutation({
    mutationFn: loginAction,
    onSuccess: (result) => {
      if (result.success) router.replace("/records");
    },
  });
  const failure = data?.success === false ? data : undefined;
  const submit = () => mutate({ email, password });

  return (
    <View className="gap-5">
      {failure && !failure.errors && (
        <FormAlert>
          {dictMessage(dict, failure.messageKey) ?? dict.unexpectedError}
        </FormAlert>
      )}
      <FormField
        label={dict.email}
        error={dictMessage(dict, failure?.errors?.email?.[0])}
      >
        <Input
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          textContentType="emailAddress"
          invalid={Boolean(failure?.errors?.email)}
        />
      </FormField>
      <FormField
        label={dict.password}
        hint={dict.passwordHint}
        error={dictMessage(dict, failure?.errors?.password?.[0])}
      >
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={submit}
          autoCapitalize="none"
          autoComplete="current-password"
          autoCorrect={false}
          maxLength={72}
          textContentType="password"
          invalid={Boolean(failure?.errors?.password)}
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
      <Button
        size="lg"
        className="mt-1 w-full"
        disabled={isPending}
        onPress={submit}
      >
        {dict.submit}
      </Button>
      <Text className="text-center text-muted-foreground text-sm">
        {dict.toRegisterPrompt}{" "}
        <TextLink href="/register">{dict.toRegister}</TextLink>
      </Text>
    </View>
  );
}
