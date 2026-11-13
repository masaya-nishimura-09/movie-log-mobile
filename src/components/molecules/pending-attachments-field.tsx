import { Plus, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { type AttachmentFile, isAttachable } from "@/actions/record/attachment";
import { Icon } from "@/components/atoms/icon";
import { Image } from "@/components/atoms/image";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { Text } from "@/components/atoms/text";
import {
  pickImages,
  tapeTilt,
} from "@/components/organisms/record-attachment-section";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import { type Attachment, maxAttachments } from "@/schemas/record/attachment";

type PendingAttachmentsFieldProps = {
  files: AttachmentFile[];
  onChange: (files: AttachmentFile[]) => void;
  existing?: Attachment[];
  onExistingChange?: (existing: Attachment[]) => void;
  dict: {
    attachmentsAdd: string;
    attachmentRemove: string;
    attachmentsInvalid: string;
    attachmentsLimit: string;
  };
};

function Thumbnail({
  uri,
  index,
  removeLabel,
  onRemove,
}: {
  uri: string;
  index: number;
  removeLabel: string;
  onRemove: () => void;
}) {
  return (
    <View className="relative w-1/3 px-1.25 pt-2">
      <View
        className="aspect-[210/297] w-full overflow-hidden rounded-[2px] bg-background"
        style={{ boxShadow: "0 6px 12px -8px rgba(10, 41, 71, 0.55)" }}
      >
        <Image
          source={{ uri }}
          contentFit="cover"
          accessibilityIgnoresInvertColors
          className="size-full"
        />
      </View>
      <MaskingTape
        className="top-0"
        tapeClassName={cn("h-3.5 w-10", tapeTilt(index))}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={removeLabel}
        onPress={onRemove}
        hitSlop={6}
        className="absolute top-3.5 right-2.75 size-7 items-center justify-center rounded-full bg-foreground/70"
      >
        <Icon icon={X} size={16} className="text-background" />
      </Pressable>
    </View>
  );
}

export function PendingAttachmentsField({
  files,
  onChange,
  existing = [],
  onExistingChange,
  dict,
}: PendingAttachmentsFieldProps) {
  const [error, setError] = useState<string>();
  const room = maxAttachments - existing.length - files.length;

  const pick = async () => {
    const picked = await pickImages(room);
    if (picked.length === 0) return;
    const valid = picked.filter(isAttachable);
    onChange([...files, ...valid.slice(0, room)]);
    setError(
      valid.length > room
        ? interpolate(dict.attachmentsLimit, { max: maxAttachments })
        : valid.length < picked.length
          ? dict.attachmentsInvalid
          : undefined,
    );
  };

  return (
    <View className="gap-2">
      <View className="-mx-1.25 flex-row flex-wrap gap-y-2.5">
        {existing.map((attachment, index) => (
          <Thumbnail
            key={attachment.attachmentId}
            uri={attachment.imageUrl}
            index={index}
            removeLabel={interpolate(dict.attachmentRemove, {
              number: index + 1,
            })}
            onRemove={() => {
              onExistingChange?.(
                existing.filter(
                  (a) => a.attachmentId !== attachment.attachmentId,
                ),
              );
              setError(undefined);
            }}
          />
        ))}
        {files.map((file, index) => (
          <Thumbnail
            key={file.uri}
            uri={file.uri}
            index={existing.length + index}
            removeLabel={interpolate(dict.attachmentRemove, {
              number: existing.length + index + 1,
            })}
            onRemove={() => {
              onChange(files.filter((_, i) => i !== index));
              setError(undefined);
            }}
          />
        ))}
        {room > 0 && (
          <View className="w-1/3 px-1.25 pt-2">
            <Pressable
              accessibilityRole="button"
              onPress={pick}
              className="aspect-[210/297] w-full items-center justify-center gap-1.5 rounded-[2px] border border-border border-dashed px-2"
            >
              <Icon icon={Plus} size={18} className="text-muted-foreground" />
              <Text className="text-center text-muted-foreground text-xs">
                {dict.attachmentsAdd}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
      {error && (
        <Text
          accessibilityRole="alert"
          className="text-destructive-foreground text-xs"
        >
          {error}
        </Text>
      )}
    </View>
  );
}
