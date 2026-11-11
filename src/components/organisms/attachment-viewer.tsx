import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react-native";
import { useRef } from "react";
import { Alert, Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ActionResult } from "@/actions/action-result";
import { Icon } from "@/components/atoms/icon";
import { Image } from "@/components/atoms/image";
import { Text } from "@/components/atoms/text";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";
import { interpolate } from "@/lib/text/interpolate";
import type { Attachment } from "@/schemas/record/attachment";

type AttachmentViewerProps = {
  attachments: Attachment[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
  remove?: (attachmentId: string) => Promise<ActionResult<null>>;
  dict: Dictionary["recordDetail"];
  deleteDict: Dictionary["deleteAttachment"];
};

const swipeDistance = 50;

function RoundButton({
  label,
  icon,
  onPress,
  disabled = false,
}: {
  label: string;
  icon: typeof X;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        "size-10 items-center justify-center rounded-full bg-white/10 active:bg-white/20",
        disabled && "opacity-30",
      )}
    >
      <Icon icon={icon} size={20} color="#f3e4c9" />
    </Pressable>
  );
}

export function AttachmentViewer({
  attachments,
  index,
  onIndexChange,
  onClose,
  remove,
  dict,
  deleteDict,
}: AttachmentViewerProps) {
  const insets = useSafeAreaInsets();
  const opened = attachments[index];
  const hasPrev = index > 0;
  const hasNext = index < attachments.length - 1;
  const swipeStart = useRef<number>(undefined);

  const move = (step: number) => {
    const next = index + step;
    if (next >= 0 && next < attachments.length) onIndexChange(next);
  };

  const confirmDelete = () => {
    if (!remove || !opened) return;
    Alert.alert(deleteDict.title, deleteDict.description, [
      { text: deleteDict.cancel, style: "cancel" },
      {
        text: deleteDict.confirm,
        style: "destructive",
        onPress: async () => {
          const result = await remove(opened.attachmentId);
          if (!result.success) Alert.alert(deleteDict.unexpectedError);
        },
      },
    ]);
  };

  return (
    <Modal
      visible={opened !== undefined}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        className="flex-1"
        style={{
          backgroundColor: "rgba(10, 41, 71, 0.94)",
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        {opened && (
          <>
            <View className="flex-row items-center justify-between gap-3 px-4 py-3">
              <Text
                accessibilityRole="header"
                className="font-medium text-sm"
                style={{ color: "rgba(243, 228, 201, 0.8)" }}
              >
                {interpolate(dict.attachmentPosition, {
                  number: index + 1,
                  total: attachments.length,
                })}
              </Text>
              <View className="flex-row items-center gap-2">
                {remove && (
                  <RoundButton
                    label={dict.attachmentDelete}
                    icon={Trash2}
                    onPress={confirmDelete}
                  />
                )}
                <RoundButton
                  label={dict.attachmentClose}
                  icon={X}
                  onPress={onClose}
                />
              </View>
            </View>
            <View
              className="min-h-0 flex-1 px-4 pb-4"
              onTouchStart={(event) => {
                swipeStart.current = event.nativeEvent.pageX;
              }}
              onTouchEnd={(event) => {
                if (swipeStart.current === undefined) return;
                const distance = event.nativeEvent.pageX - swipeStart.current;
                swipeStart.current = undefined;
                if (distance > swipeDistance) move(-1);
                if (distance < -swipeDistance) move(1);
              }}
            >
              <Image
                key={opened.attachmentId}
                source={{ uri: opened.imageUrl }}
                contentFit="contain"
                accessibilityIgnoresInvertColors
                className="size-full rounded-lg"
              />
            </View>
            {attachments.length > 1 && (
              <View className="flex-row justify-center gap-6 pb-6">
                <RoundButton
                  label={dict.attachmentPrev}
                  icon={ChevronLeft}
                  disabled={!hasPrev}
                  onPress={() => move(-1)}
                />
                <RoundButton
                  label={dict.attachmentNext}
                  icon={ChevronRight}
                  disabled={!hasNext}
                  onPress={() => move(1)}
                />
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}
