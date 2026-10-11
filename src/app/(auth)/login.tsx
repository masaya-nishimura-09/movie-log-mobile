import { View } from "react-native";
import { Logo } from "@/components/atoms/logo";
import { Text } from "@/components/atoms/text";
import { LoginForm } from "@/components/organisms/login-form";
import { useI18n } from "@/i18n/use-i18n";

export default function LoginPage() {
  const { dict } = useI18n();

  return (
    <View className="gap-6">
      <View className="items-center gap-2">
        <Logo name={dict.brand.name} large />
        <Text className="text-center text-[13px] text-foreground-sub">
          {dict.brand.tagline}
        </Text>
      </View>
      <LoginForm dict={dict.login} passwordDict={dict.passwordInput} />
    </View>
  );
}
