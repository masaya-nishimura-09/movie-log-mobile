import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { updateUsernameAction } from "@/actions/user/update-username";
import { AccountFormCard } from "@/components/molecules/account-form-card";
import { CountedInput } from "@/components/molecules/counted-input";
import { FormField } from "@/components/molecules/form-field";
import { useToast } from "@/components/molecules/toaster";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { User } from "@/schemas/user/user";

type AccountUsernameFormProps = {
  user: User;
  dict: Dictionary["account"];
  counterTemplate: string;
};

export function AccountUsernameForm({
  user,
  dict,
  counterTemplate,
}: AccountUsernameFormProps) {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [username, setUsername] = useState(user.username);
  const { mutate, data, isPending } = useMutation({
    mutationFn: updateUsernameAction,
    onSuccess: async (result) => {
      if (!result.success) return;
      toast(dict.saved);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
  const failure = data?.success === false ? data : undefined;

  useEffect(() => {
    setUsername(user.username);
  }, [user.username]);

  return (
    <AccountFormCard
      title={dict.usernameTitle}
      failure={failure}
      pending={isPending}
      onSave={() => mutate({ username })}
      dict={dict}
    >
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
    </AccountFormCard>
  );
}
