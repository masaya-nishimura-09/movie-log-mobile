import { Trash2 } from "lucide-react-native";
import { Alert } from "react-native";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { formatDate } from "@/lib/date/format-date";
import { interpolate } from "@/lib/text/interpolate";

type DeleteRecordDialogProps = {
  onDelete: () => Promise<ActionResult<null>>;
  title: string;
  watchedAt: string;
  locale: Locale;
  triggerLabel: string;
  dict: Dictionary["deleteRecord"];
};

export function DeleteRecordDialog({
  onDelete,
  title,
  watchedAt,
  locale,
  triggerLabel,
  dict,
}: DeleteRecordDialogProps) {
  const confirm = () => {
    Alert.alert(
      dict.title,
      interpolate(dict.description, {
        title,
        date: formatDate(watchedAt, locale, "medium"),
      }),
      [
        { text: dict.cancel, style: "cancel" },
        {
          text: dict.confirm,
          style: "destructive",
          onPress: async () => {
            const result = await onDelete();
            if (!result.success) Alert.alert(dict.unexpectedError);
          },
        },
      ],
    );
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      icon={Trash2}
      iconSize={18}
      accessibilityLabel={triggerLabel}
      onPress={confirm}
      className="px-2.5"
    />
  );
}
