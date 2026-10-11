import { LegalDocument } from "@/components/organisms/legal-document";
import { useI18n } from "@/i18n/use-i18n";

export default function PrivacyPage() {
  const { dict } = useI18n();
  const { legal } = dict;

  return (
    <LegalDocument
      title={legal.privacy.title}
      intro={legal.privacy.intro}
      sections={legal.privacy.sections}
      updatedLabel={legal.updatedLabel}
      updated={legal.updated}
      contactLabel={legal.contactLabel}
      contactPending={legal.contactPending}
      backLabel={legal.back}
    />
  );
}
