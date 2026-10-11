import { Select } from "@/components/molecules/select";
import { useReplaceQuery } from "@/hooks/use-replace-query";

type SortOption = { value: string; label: string; href: string };

type SortSelectProps = {
  label: string;
  closeLabel: string;
  value: string;
  options: SortOption[];
  className?: string;
};

export function SortSelect({
  label,
  closeLabel,
  value,
  options,
  className,
}: SortSelectProps) {
  const replaceQuery = useReplaceQuery();

  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => {
        const option = options.find((o) => o.value === next);
        if (option) replaceQuery(option.href);
      }}
      label={label}
      closeLabel={closeLabel}
      size="sm"
      className={className}
    />
  );
}
