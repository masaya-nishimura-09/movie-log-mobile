import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { updatePasswordAction } from "@/actions/user/update-password";
import { AccountFormCard } from "@/components/molecules/account-form-card";
import { FormField } from "@/components/molecules/form-field";
import { PasswordInput } from "@/components/molecules/password-input";
import { useToast } from "@/components/molecules/toaster";
import type { Dictionary } from "@/i18n/get-dictionary";

type AccountPasswordFormProps = {
  dict: Dictionary["account"];
  passwordDict: Dictionary["passwordInput"];
};

export function AccountPasswordForm({
  dict,
  passwordDict,
}: AccountPasswordFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { mutate, data, isPending } = useMutation({
    mutationFn: updatePasswordAction,
    onSuccess: (result) => {
      if (!result.success) return;
      setOldPassword("");
      setNewPassword("");
      toast(dict.saved);
      if (!result.data.loggedIn) {
        queryClient.clear();
        router.replace("/login");
      }
    },
  });
  const failure = data?.success === false ? data : undefined;

  return (
    <AccountFormCard
      title={dict.passwordTitle}
      failure={failure}
      pending={isPending}
      onSave={() => mutate({ oldPassword, newPassword })}
      dict={dict}
    >
      <FormField
        label={dict.currentPassword}
        error={failure?.errors?.oldPassword && dict.passwordError}
      >
        <PasswordInput
          value={oldPassword}
          onChangeText={setOldPassword}
          autoCapitalize="none"
          autoComplete="current-password"
          autoCorrect={false}
          maxLength={72}
          invalid={Boolean(failure?.errors?.oldPassword)}
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
      <FormField
        label={dict.newPassword}
        hint={dict.passwordHint}
        error={failure?.errors?.newPassword && dict.passwordError}
      >
        <PasswordInput
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          autoComplete="new-password"
          autoCorrect={false}
          maxLength={72}
          invalid={Boolean(failure?.errors?.newPassword)}
          showLabel={passwordDict.show}
          hideLabel={passwordDict.hide}
        />
      </FormField>
    </AccountFormCard>
  );
}
