import { type Href, Link } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react-native";
import { View } from "react-native";
import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";

type PaginationProps = {
  previousHref: string | undefined;
  nextHref: string | undefined;
  status: string;
  previousLabel: string;
  nextLabel: string;
};

function PageButton({
  href,
  label,
  icon,
}: {
  href: string | undefined;
  label: string;
  icon: LucideIcon;
}) {
  const button = (
    <Button
      variant="outline"
      size="icon"
      icon={icon}
      accessibilityLabel={label}
      disabled={href === undefined}
      className={cn(href === undefined && "opacity-40")}
    />
  );
  if (href === undefined) return button;
  return (
    <Link href={href as Href} replace asChild>
      {button}
    </Link>
  );
}

export function Pagination({
  previousHref,
  nextHref,
  status,
  previousLabel,
  nextLabel,
}: PaginationProps) {
  return (
    <View className="flex-row items-center justify-center gap-3">
      <PageButton
        href={previousHref}
        label={previousLabel}
        icon={ChevronLeft}
      />
      <Text className="text-muted-foreground text-sm">{status}</Text>
      <PageButton href={nextHref} label={nextLabel} icon={ChevronRight} />
    </View>
  );
}
