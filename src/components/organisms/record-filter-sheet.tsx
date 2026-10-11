import { SlidersHorizontal } from "lucide-react-native";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Sheet } from "@/components/molecules/sheet";
import { useReplaceQuery } from "@/hooks/use-replace-query";
import type { Dictionary } from "@/i18n/get-dictionary";
import { interpolate } from "@/lib/text/interpolate";

type RecordFilterSheetProps = {
  activeCount: number;
  resultCount: number;
  clearHref: string;
  closeLabel: string;
  dict: Dictionary["recordFilter"];
  children: ReactNode;
};

export function RecordFilterSheet({
  activeCount,
  resultCount,
  clearHref,
  closeLabel,
  dict,
  children,
}: RecordFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const replaceQuery = useReplaceQuery();

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        active={activeCount > 0}
        icon={SlidersHorizontal}
        iconSize={16}
        accessibilityLabel={dict.open}
        onPress={() => setOpen(true)}
        className="px-3"
      >
        {activeCount > 0 ? String(activeCount) : undefined}
      </Button>
      <Sheet
        visible={open}
        onClose={() => setOpen(false)}
        title={dict.title}
        closeLabel={closeLabel}
        headerAction={
          <Button
            variant="ghost"
            size="sm"
            onPress={() => replaceQuery(clearHref)}
          >
            {dict.clearAll}
          </Button>
        }
        footer={
          <Button className="w-full" onPress={() => setOpen(false)}>
            {interpolate(dict.showResults, { count: resultCount })}
          </Button>
        }
      >
        {children}
      </Sheet>
    </>
  );
}
