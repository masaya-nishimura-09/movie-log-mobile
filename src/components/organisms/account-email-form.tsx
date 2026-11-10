import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updateEmailAction } from "@/actions/user/update-email";
import { Input } from "@/components/atoms/input";
import { AccountFormCard } from "@/components/molecules/account-form-card";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import { useToast } from "@/components/molecules/toaster";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { User } from "@/schemas/user/user";

type AccountEmailFormProps = {
  user: User;
  dict: Dictionary["account"];
  passwordDict: Dictionary["passwordInput"];
};

export function AccountEmailForm({
  user,
  dict,
  passwordDict,
}: AccountEmailFormProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const { mutate, data, isPending } = useMutation({
    mutationFn: updateEmailAction,
    onSuccess: async (result) => {
      if (!result.success) return;
      setPassword("");
      toast(dict.saved);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  const failure = data?.success === false ? data : undefined;

  useEffect(() => {
    setEmail(user.email);
  }, [user.email]);

  return (
    <AccountFormCard
      title={dict.emailTitle}
      failure={failure}
      pending={isPending}
      onSave={() => mutate({ email, password })}
      dict={dict}
    >
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
        label={dict.currentPassword}
        hint={dict.currentPasswordHint}
        error={failure?.errors?.password && dict.passwordError}
      >
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoComplete="current-password"
          autoCorrect={false}
          maxLength={72}
          invalid={Boolean(failure?.errors?.password)}
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
    </AccountFormCard>
  );
}
