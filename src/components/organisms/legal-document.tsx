import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Linking, Pressable, View } from "react-native";
import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { contactFormUrl } from "@/lib/legal/contact";

type LegalSection = { h: string; p: string[] };

type LegalDocumentProps = {
  title: string;
  intro: string;
  sections: LegalSection[];
  updatedLabel: string;
  updated: string;
  contactLabel: string;
  contactPending: string;
  backLabel: string;
};

export function LegalDocument({
  title,
  intro,
  sections,
  updatedLabel,
  updated,
  contactLabel,
  contactPending,
  backLabel,
}: LegalDocumentProps) {
  const router = useRouter();

  return (
    <View className="gap-6">
      <View className="gap-2">
        <Text className="font-bold text-2xl text-foreground">{title}</Text>
        <Text className="text-muted-foreground text-xs">
          {updatedLabel}: {updated}
        </Text>
      </View>
      <Text className="text-[13px] text-foreground-sub leading-relaxed">
        {intro}
      </Text>
      {sections.map((section, index) => (
        <View key={section.h} className="gap-2">
          <Text className="font-bold text-base text-foreground">
            {section.h}
          </Text>
          {section.p.map((paragraph) => (
            <Text
              key={paragraph}
              className="text-[13px] text-foreground-sub leading-relaxed"
            >
              {paragraph}
            </Text>
          ))}
          {index === sections.length - 1 &&
            (contactFormUrl === "" ? (
              <Text className="text-[13px] text-foreground-sub">
                {contactLabel}: {contactPending}
              </Text>
            ) : (
              <Pressable
                accessibilityRole="link"
                onPress={() => Linking.openURL(contactFormUrl)}
                className="self-start"
              >
                <Text className="font-medium text-[13px] text-primary">
                  {contactLabel}
                </Text>
              </Pressable>
            ))}
        </View>
      ))}
      <Button
        variant="outline"
        icon={ArrowLeft}
        className="self-center"
        onPress={() => router.back()}
      >
        {backLabel}
      </Button>
    </View>
  );
}
