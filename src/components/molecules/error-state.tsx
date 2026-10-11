import { Button } from "@/components/atoms/button";
import { EmptyState } from "@/components/molecules/empty-state";
import type { Dictionary } from "@/i18n/get-dictionary";

type ErrorStateProps = {
  dict: Dictionary["errorPage"];
  onRetry: () => void;
};

export function ErrorState({ dict, onRetry }: ErrorStateProps) {
  return (
    <EmptyState
      title={dict.title}
      description={dict.description}
      action={<Button onPress={onRetry}>{dict.retry}</Button>}
    />
  );
}
