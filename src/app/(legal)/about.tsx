import { AboutContent } from "@/components/organisms/about-content";
import { useI18n } from "@/i18n/use-i18n";

export default function AboutPage() {
  const { dict } = useI18n();

  return <AboutContent dict={dict} />;
}
