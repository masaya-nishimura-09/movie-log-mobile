import { strToU8, zipSync } from "fflate";
import { Download } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import type { ActionResult } from "@/actions/action-result";
import { Button } from "@/components/atoms/button";
import { Text } from "@/components/atoms/text";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { noteFiles } from "@/lib/export/note-markdown";
import { localDate, toRecordsCsv } from "@/lib/export/records-csv";
import { shareFile } from "@/lib/export/share-file";
import type { MovieRecord, RecordDetail } from "@/schemas/record/record";

type ExportSectionProps = {
  locale: Locale;
  exportRecords: () => Promise<ActionResult<MovieRecord[]>>;
  exportNotes: () => Promise<ActionResult<RecordDetail[]>>;
  dict: Dictionary["account"];
  csvDict: Pick<Dictionary, "recordForm" | "enums">;
  releaseYearTemplate: string;
};

export function ExportSection({
  locale,
  exportRecords,
  exportNotes,
  dict,
  csvDict,
  releaseYearTemplate,
}: ExportSectionProps) {
  const [failed, setFailed] = useState(false);
  const [running, setRunning] = useState<"records" | "notes">();
  const today = () => localDate(new Date().toISOString());

  const run = async (kind: "records" | "notes") => {
    setRunning(kind);
    try {
      if (kind === "records") {
        const result = await exportRecords();
        setFailed(!result.success);
        if (result.success) {
          await shareFile(
            `cinelier-records-${today()}.csv`,
            toRecordsCsv(result.data, locale, csvDict),
            "text/csv",
          );
        }
      } else {
        const result = await exportNotes();
        setFailed(!result.success);
        if (result.success) {
          const files = noteFiles(result.data, {
            watchedAt: csvDict.recordForm.watchedAt,
            updatedAt: dict.exportUpdatedAt,
            releaseYear: releaseYearTemplate,
          });
          await shareFile(
            `cinelier-notes-${today()}.zip`,
            zipSync(
              Object.fromEntries(
                files.map((file) => [file.name, strToU8(file.text)]),
              ),
            ),
            "application/zip",
          );
        }
      }
    } catch {
      setFailed(true);
    } finally {
      setRunning(undefined);
    }
  };

  return (
    <View className="items-start gap-2 rounded-2xl bg-card px-4 py-4.5">
      <Text
        accessibilityRole="header"
        className="font-bold text-[15px] text-foreground"
      >
        {dict.exportTitle}
      </Text>
      <Text className="text-[13px] text-foreground-sub">
        {dict.exportDescription}
      </Text>
      <View className="mt-2 flex-row flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          disabled={running !== undefined}
          onPress={() => run("records")}
        >
          {running === "records" ? dict.exporting : dict.exportAction}
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={Download}
          disabled={running !== undefined}
          onPress={() => run("notes")}
        >
          {running === "notes" ? dict.exporting : dict.exportNotesAction}
        </Button>
      </View>
      {failed && (
        <Text
          accessibilityRole="alert"
          className="text-destructive-foreground text-sm"
        >
          {dict.exportFailed}
        </Text>
      )}
    </View>
  );
}
