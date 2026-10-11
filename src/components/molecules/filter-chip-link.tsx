import {
  ChoiceChip,
  type ChoiceChipStyle,
} from "@/components/atoms/choice-chip";
import { useReplaceQuery } from "@/hooks/use-replace-query";

type FilterChipLinkProps = ChoiceChipStyle & {
  href: string;
  active: boolean;
  className?: string;
  labelClassName?: string;
  children: string;
};

export function FilterChipLink({
  href,
  active,
  shape,
  size,
  tone,
  className,
  labelClassName,
  children,
}: FilterChipLinkProps) {
  const replaceQuery = useReplaceQuery();

  return (
    <ChoiceChip
      active={active}
      shape={shape}
      size={size}
      tone={tone}
      className={className}
      labelClassName={labelClassName}
      onPress={() => replaceQuery(href)}
    >
      {children}
    </ChoiceChip>
  );
}
