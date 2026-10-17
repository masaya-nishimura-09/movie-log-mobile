import { View } from "react-native";
import { Logo } from "@/components/atoms/logo";
import { Text } from "@/components/atoms/text";
import { TextLink } from "@/components/atoms/text-link";
import { RegisterForm } from "@/components/organisms/register-form";
import { useI18n } from "@/i18n/use-i18n";

export default function RegisterPage() {
  const { dict } = useI18n();

  return (
    <View className="gap-6">
      <View className="items-center">
        <Logo name={dict.brand.name} large />
      </View>
      <View className="gap-1.5">
        <Text className="font-bold text-foreground text-xl">
          {dict.register.title}
        </Text>
        <Text className="text-muted-foreground text-xs">
          {dict.register.description}
        </Text>
      </View>
      <RegisterForm
        dict={dict.register}
        passwordDict={dict.passwordInput}
        counterTemplate={dict.characterCount}
      />
      <View className="items-center">
        <TextLink href="/about" tone="muted" className="text-xs">
          {dict.about.link}
        </TextLink>
      </View>
    </View>
  );
}
