import { LegalDocument } from "@/components/organisms/legal-document";
import { useI18n } from "@/i18n/use-i18n";

export default function TermsPage() {
  const { dict, locale } = useI18n();
  const { legal } = dict;

  return (
    <LegalDocument
      locale={locale}
      title={legal.terms.title}
      intro={legal.terms.intro}
      sections={legal.terms.sections}
      updatedLabel={legal.updatedLabel}
      updated={legal.updated}
      contactLabel={legal.contactLabel}
      contactPending={legal.contactPending}
      backLabel={legal.back}
    />
  );
}
