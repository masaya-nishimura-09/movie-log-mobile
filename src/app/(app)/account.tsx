import { Info } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Inset } from "@/components/atoms/inset";
import { Text } from "@/components/atoms/text";
import { ErrorState } from "@/components/molecules/error-state";
import { LoadingState } from "@/components/molecules/loading-state";
import { AccountEmailForm } from "@/components/organisms/account-email-form";
import { AccountPasswordForm } from "@/components/organisms/account-password-form";
import { AccountUsernameForm } from "@/components/organisms/account-username-form";
import { PageTopBar } from "@/components/organisms/page-top-bar";
import { WithdrawSection } from "@/components/organisms/withdraw-section";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useI18n } from "@/i18n/use-i18n";

export default function AccountPage() {
  const { dict } = useI18n();
  const { data: user, isPending, isError, refetch } = useCurrentUser();

  const body = () => {
    if (isPending) return <LoadingState />;
    if (isError) {
      return (
        <ErrorState dict={dict.errorPage} onRetry={() => void refetch()} />
      );
    }
    return (
      <ScrollView
        contentContainerClassName="gap-4 px-4 pt-5 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row gap-2.5 rounded-[14px] bg-mood px-4 py-3.5">
          <Icon icon={Info} size={18} className="mt-0.5 text-mood-foreground" />
          <Text className="flex-1 text-[13px] text-mood-foreground leading-relaxed">
            {dict.account.notice}
          </Text>
        </View>
        <AccountUsernameForm
          user={user}
          dict={dict.account}
          counterTemplate={dict.characterCount}
        />
        <AccountEmailForm
          user={user}
          dict={dict.account}
          passwordDict={dict.passwordInput}
        />
        <AccountPasswordForm
          dict={dict.account}
          passwordDict={dict.passwordInput}
        />
        <WithdrawSection dict={dict.account} />
      </ScrollView>
    );
  };

  return (
    <Inset>
      <View className="flex-1 bg-background">
        <PageTopBar
          backHref="/records"
          backLabel={dict.account.back}
          title={dict.account.title}
        />
        {body()}
      </View>
    </Inset>
  );
}
