import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/atoms/button";
import { Image } from "@/components/atoms/image";
import { Logo } from "@/components/atoms/logo";
import { SectionLabel } from "@/components/atoms/section-label";
import { Text } from "@/components/atoms/text";
import { TextLink } from "@/components/atoms/text-link";
import type { Dictionary } from "@/i18n/get-dictionary";

const tmdbLogo = require("../../../assets/images/tmdb-logo.png");

type AboutContentProps = {
  dict: Dictionary;
};

export function AboutContent({ dict }: AboutContentProps) {
  const router = useRouter();

  return (
    <View className="gap-6">
      <View className="items-center gap-2">
        <Logo name={dict.brand.name} large />
        <Text className="text-center text-[13px] text-foreground-sub">
          {dict.brand.tagline}
        </Text>
      </View>
      <View className="gap-3">
        <SectionLabel>{dict.about.creditsHeading}</SectionLabel>
        <Image
          source={tmdbLogo}
          contentFit="contain"
          accessibilityLabel="TMDB"
          className="h-3.5 w-27 self-start"
        />
        <Text className="text-[13px] text-foreground-sub leading-relaxed">
          {dict.about.tmdbNotice}
        </Text>
      </View>
      <View className="items-start gap-2">
        <TextLink href="/terms" className="text-sm">
          {dict.register.termsLink}
        </TextLink>
        <TextLink href="/privacy" className="text-sm">
          {dict.register.privacyLink}
        </TextLink>
      </View>
      <Button
        variant="outline"
        icon={ArrowLeft}
        className="self-center"
        onPress={() => router.back()}
      >
        {dict.about.back}
      </Button>
    </View>
  );
}
