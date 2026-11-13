import { useRouter } from "expo-router";
import { type ReactNode, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { uploadPosterAction } from "@/actions/media/upload-poster";
import {
  type AttachmentFile,
  addAttachmentAction,
  deleteAttachmentAction,
} from "@/actions/record/attachment";
import { Button } from "@/components/atoms/button";
import { FormAlert } from "@/components/atoms/form-alert";
import { Text } from "@/components/atoms/text";
import { FormField } from "@/components/molecules/form-field";
import { PendingAttachmentsField } from "@/components/molecules/pending-attachments-field";
import { useToast } from "@/components/molecules/toaster";
import { RecordBasicsFields } from "@/components/organisms/record-basics-fields";
import { RecordImpressionFields } from "@/components/organisms/record-impression-fields";
import { RecordMovieFields } from "@/components/organisms/record-movie-fields";
import { useRecordForm } from "@/hooks/use-record-form";
import { useSaveRecord } from "@/hooks/use-save-record";
import type { Dictionary } from "@/i18n/get-dictionary";
import type { Locale } from "@/i18n/locales";
import { toRecordInputValues } from "@/lib/record/record-form-state";
import { dictMessage } from "@/lib/text/dict-message";
import type { Attachment } from "@/schemas/record/attachment";
import type { RecordFormValues } from "@/schemas/record/record-form";

type RecordEditFormProps = {
  recordId: string;
  locale: Locale;
  values: RecordFormValues;
  attachments: Attachment[];
  maxReleaseYear: number;
  dict: Dictionary["recordForm"];
  enums: Dictionary["enums"];
  counterTemplate: string;
  editorDict: Dictionary["noteEditor"];
  closeLabel: string;
};

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-4.5 rounded-[18px] bg-card p-4.5">
      <Text className="font-bold text-base text-foreground">{title}</Text>
      {children}
    </View>
  );
}

export function RecordEditForm({
  recordId,
  locale,
  values,
  attachments,
  maxReleaseYear,
  dict,
  enums,
  counterTemplate,
  editorDict,
  closeLabel,
}: RecordEditFormProps) {
  const router = useRouter();
  const { form, update, selectMovie, searchMovies } = useRecordForm(
    values,
    locale,
  );
  const [kept, setKept] = useState(attachments);
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const { mutate, data, isPending } = useSaveRecord(
    recordId,
    undefined,
    async (savedId) => {
      const removed = attachments.filter(
        (attachment) =>
          !kept.some((a) => a.attachmentId === attachment.attachmentId),
      );
      if (removed.length === 0 && files.length === 0) return;
      setUploading(true);
      let ok = true;
      for (const attachment of removed) {
        const result = await deleteAttachmentAction(
          savedId,
          attachment.attachmentId,
        );
        if (!result.success) ok = false;
      }
      for (const file of files) {
        const result = await addAttachmentAction(savedId, file);
        if (!result.success) ok = false;
      }
      setUploading(false);
      if (!ok) toast(dict.attachmentsUploadFailed);
    },
  );
  const failure = data?.success === false ? data : undefined;
  const message =
    dictMessage(dict, failure?.messageKey) ?? dict.unexpectedError;

  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pt-5 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        {failure && <FormAlert>{message}</FormAlert>}
        <Panel title={dict.watchSection}>
          <RecordBasicsFields
            locale={locale}
            closeLabel={closeLabel}
            form={form}
            update={update}
            searchMovies={searchMovies}
            onMovieSelect={selectMovie}
            errors={failure?.errors}
            dict={dict}
            enums={enums}
            counterTemplate={counterTemplate}
          />
        </Panel>
        <Panel title={dict.movieSection}>
          <RecordMovieFields
            locale={locale}
            form={form}
            update={update}
            errors={failure?.errors}
            maxReleaseYear={maxReleaseYear}
            uploadPoster={uploadPosterAction}
            dict={dict}
            enums={enums}
            counterTemplate={counterTemplate}
            closeLabel={closeLabel}
          />
        </Panel>
        <Panel title={dict.stepImpression}>
          <RecordImpressionFields
            form={form}
            update={update}
            errors={failure?.errors}
            dict={dict}
            enums={enums}
            editorDict={editorDict}
          />
          <FormField label={dict.attachments} hint={dict.attachmentsHint}>
            <PendingAttachmentsField
              files={files}
              onChange={setFiles}
              existing={kept}
              onExistingChange={setKept}
              dict={dict}
            />
          </FormField>
        </Panel>
      </ScrollView>
      <View className="flex-row items-center justify-end gap-2 px-4 pt-3 pb-4">
        <Button variant="outline" onPress={() => router.back()}>
          {dict.cancel}
        </Button>
        <Button
          disabled={isPending}
          onPress={() => mutate(toRecordInputValues(form))}
        >
          {uploading ? dict.uploadingAttachments : dict.saveChanges}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
