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
import { maxAttachments } from "@/schemas/record/attachment";

type PendingAttachmentsFieldProps = {
  files: AttachmentFile[];
  onChange: (files: AttachmentFile[]) => void;
  dict: {
    attachmentsAdd: string;
    attachmentRemove: string;
    attachmentsInvalid: string;
    attachmentsLimit: string;
  };
};

export function PendingAttachmentsField({
  files,
  onChange,
  dict,
}: PendingAttachmentsFieldProps) {
  const [error, setError] = useState<string>();
  const room = maxAttachments - files.length;

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
        {files.map((file, index) => (
          <View key={file.uri} className="relative w-1/3 px-1.25 pt-2">
            <View
              className="aspect-[210/297] w-full overflow-hidden rounded-[2px] bg-background"
              style={{ boxShadow: "0 6px 12px -8px rgba(10, 41, 71, 0.55)" }}
            >
              <Image
                source={{ uri: file.uri }}
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
              accessibilityLabel={interpolate(dict.attachmentRemove, {
                number: index + 1,
              })}
              onPress={() => {
                onChange(files.filter((_, i) => i !== index));
                setError(undefined);
              }}
              hitSlop={6}
              className="absolute top-3.5 right-2.75 size-7 items-center justify-center rounded-full bg-foreground/70"
            >
              <Icon icon={X} size={16} className="text-background" />
            </Pressable>
          </View>
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
