import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { registerAction } from "@/actions/user/register";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { Input } from "@/components/atoms/input";
import { Text } from "@/components/atoms/text";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormAlert } from "@/components/molecules/form-alert";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";
import { interpolateNode } from "@/lib/text/interpolate-node";

type RegisterFormProps = {
  dict: Dictionary["register"];
  passwordDict: Dictionary["passwordInput"];
  counterTemplate: string;
};

export function RegisterForm({
  dict,
  passwordDict,
  counterTemplate,
}: RegisterFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { mutate, data, isPending } = useMutation({
    mutationFn: registerAction,
    onSuccess: (result) => {
      if (!result.success) return;
      queryClient.clear();
      router.replace(result.data.loggedIn ? "/records" : "/login");
    },
  });
  const failure = data?.success === false ? data : undefined;
  const message = (key: string) =>
    key in dict ? dict[key as keyof typeof dict] : dict.unexpectedError;

  const link = (label: string, href: "/terms" | "/privacy") => (
    <Text
      onPress={() => router.push(href)}
      className="font-medium text-primary"
    >
      {label}
    </Text>
  );

  return (
    <View className="gap-5">
      {failure && !failure.errors && (
        <FormAlert>{message(failure.messageKey)}</FormAlert>
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
          autoComplete="nickname"
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
          autoComplete="email"
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
      <View className="gap-2">
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreedToTerms }}
          onPress={() => setAgreedToTerms((agreed) => !agreed)}
          className="flex-row items-center gap-2"
        >
          <View
            className={cn(
              "size-4.25 items-center justify-center rounded-[5px]",
              agreedToTerms ? "bg-selected-border" : "bg-field",
            )}
          >
            {agreedToTerms && (
              <Icon
                icon={Check}
                size={12}
                strokeWidth={3}
                className="text-primary-foreground"
              />
            )}
          </View>
          <Text className="flex-1 font-medium text-foreground text-sm">
            {interpolateNode(dict.agreeTerms, {
              terms: link(dict.termsLink, "/terms"),
            })}
          </Text>
        </Pressable>
        <Text className="text-muted-foreground text-xs">
          {interpolateNode(dict.privacyNote, {
            privacy: link(dict.privacyLink, "/privacy"),
          })}
        </Text>
      </View>
      <Button
        size="lg"
        className="mt-1 w-full"
        disabled={isPending}
        onPress={() => mutate({ username, email, password, agreedToTerms })}
      >
        {dict.submit}
      </Button>
      <Text className="text-center text-muted-foreground text-sm">
        {dict.toLoginPrompt}{" "}
        <Text
          onPress={() => router.replace("/login")}
          className="font-medium text-primary"
        >
          {dict.toLogin}
        </Text>
      </Text>
    </View>
  );
}
