import * as ImagePicker from "expo-image-picker";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import type { ActionResult } from "@/actions/action-result";
import type { AttachmentFile } from "@/actions/record/attachment";
import { Icon } from "@/components/atoms/icon";
import { Image } from "@/components/atoms/image";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { SectionLabel } from "@/components/atoms/section-label";
import { Text } from "@/components/atoms/text";
import { InfoTip } from "@/components/molecules/info-tip";
import { AttachmentViewer } from "@/components/organisms/attachment-viewer";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { type Attachment, maxAttachments } from "@/schemas/record/attachment";

type RecordAttachmentSectionProps = {
  attachments: Attachment[];
  add?: (file: AttachmentFile) => Promise<ActionResult<null>>;
  remove?: (attachmentId: string) => Promise<ActionResult<null>>;
  dict: Dictionary["recordDetail"];
  deleteDict: Dictionary["deleteAttachment"];
};

export function tapeTilt(index: number): string | undefined {
  if (index % 3 === 2) return "rotate-2";
  if (index % 3 === 1) return "-rotate-1";
  return undefined;
}

export async function pickImages(limit: number): Promise<AttachmentFile[]> {
  const picked = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsMultipleSelection: true,
    selectionLimit: limit,
  });
  if (picked.canceled) return [];
  return picked.assets.map((asset, index) => ({
    uri: asset.uri,
    name: asset.fileName ?? `attachment-${index + 1}`,
    type: asset.mimeType ?? "image/jpeg",
    size: asset.fileSize,
  }));
}

export function RecordAttachmentSection({
  attachments,
  add,
  remove,
  dict,
  deleteDict,
}: RecordAttachmentSectionProps) {
  const [openId, setOpenId] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);
  const openIndex = attachments.findIndex((a) => a.attachmentId === openId);
  const room = maxAttachments - attachments.length;

  const pick = async () => {
    if (!add) return;
    const files = await pickImages(room);
    if (files.length === 0) return;
    setPending(true);
    let ok = true;
    for (const file of files.slice(0, room)) {
      const result = await add(file);
      if (!result.success) ok = false;
    }
    setPending(false);
    setError(
      files.length > room
        ? interpolate(dict.attachmentsLimit, { max: maxAttachments })
        : ok
          ? undefined
          : dict.attachmentsUploadError,
    );
  };

  const canAdd = add !== undefined && room > 0;

  return (
    <View className="gap-2.5">
      <View className="flex-row items-center gap-1">
        <SectionLabel>{dict.attachments}</SectionLabel>
        <InfoTip
          label={interpolate(dict.infoLabel, { name: dict.attachments })}
        >
          {dict.attachmentsInfo}
        </InfoTip>
      </View>
      {attachments.length > 0 || canAdd ? (
        <View className="-mx-1.25 flex-row flex-wrap gap-y-2.5">
          {attachments.map((attachment, index) => (
            <View
              key={attachment.attachmentId}
              className="relative w-1/3 px-1.25 pt-2"
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={interpolate(dict.attachmentOpen, {
                  number: index + 1,
                })}
                onPress={() => setOpenId(attachment.attachmentId)}
                className="aspect-[210/297] w-full overflow-hidden rounded-[2px] bg-card"
                style={{ boxShadow: "0 6px 12px -8px rgba(10, 41, 71, 0.55)" }}
              >
                <Image
                  source={{ uri: attachment.imageUrl }}
                  contentFit="cover"
                  accessibilityIgnoresInvertColors
                  className="size-full"
                />
              </Pressable>
              <MaskingTape
                className="top-0"
                tapeClassName={cn("h-3.5 w-10", tapeTilt(index))}
              />
            </View>
          ))}
          {canAdd && (
            <View className="w-1/3 px-1.25 pt-2">
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: pending }}
                disabled={pending}
                onPress={pick}
                className={cn(
                  "aspect-[210/297] w-full items-center justify-center gap-1.5 rounded-[2px] border border-border border-dashed px-2",
                  pending && "opacity-50",
                )}
              >
                <Icon icon={Plus} size={18} className="text-muted-foreground" />
                <Text className="text-center text-muted-foreground text-xs">
                  {pending ? dict.attachmentsUploading : dict.attachmentsAdd}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View className="rounded-2xl border border-border border-dashed px-5.5 py-5">
          <Text className="text-[15px] text-muted-foreground">
            {dict.attachmentsEmpty}
          </Text>
        </View>
      )}
      {error && (
        <Text
          accessibilityRole="alert"
          className="text-destructive-foreground text-xs"
        >
          {error}
        </Text>
      )}
      <AttachmentViewer
        attachments={attachments}
        index={openIndex}
        onIndexChange={(index) => setOpenId(attachments[index]?.attachmentId)}
        onClose={() => setOpenId(undefined)}
        remove={remove}
        dict={dict}
        deleteDict={deleteDict}
      />
    </View>
  );
}
