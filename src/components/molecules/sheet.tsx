import { X } from "lucide-react-native";
import type { ReactNode } from "react";
import { Modal, Pressable, ScrollView, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { SafeAreaView } from "@/components/atoms/safe-area-view";
import { Text } from "@/components/atoms/text";

type SheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
};

export function Sheet({
  visible,
  onClose,
  title,
  closeLabel,
  headerAction,
  footer,
  children,
}: SheetProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <Pressable
          accessibilityLabel={closeLabel}
          className="flex-1"
          onPress={onClose}
        />
        <SafeAreaView
          edges={["bottom"]}
          className="max-h-[85%] rounded-t-[20px] bg-card"
        >
          <View className="flex-row items-center justify-between border-border border-b px-4 py-3">
            <Text className="font-bold text-base text-foreground">{title}</Text>
            <View className="flex-row items-center gap-2">
              {headerAction}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={closeLabel}
                onPress={onClose}
                className="size-9 items-center justify-center"
              >
                <Icon icon={X} size={20} className="text-muted-foreground" />
              </Pressable>
            </View>
          </View>
          <ScrollView
            className="shrink"
            contentContainerClassName="px-4 py-4"
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
          {footer && (
            <View className="border-border border-t px-4 py-3">{footer}</View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
}
