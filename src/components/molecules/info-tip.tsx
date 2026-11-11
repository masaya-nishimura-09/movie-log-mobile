import { Info } from "lucide-react-native";
import { type ComponentRef, useRef, useState } from "react";
import { Modal, Pressable, useWindowDimensions, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";

type InfoTipProps = {
  label: string;
  children: string;
};

export function InfoTip({ label, children }: InfoTipProps) {
  const trigger = useRef<ComponentRef<typeof Pressable>>(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number }>();
  const { width: screenWidth } = useWindowDimensions();

  const open = () => {
    trigger.current?.measureInWindow((x, y, _width, height) =>
      setAnchor({ x, y: y + height + 6 }),
    );
  };

  return (
    <>
      <Pressable
        ref={trigger}
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ expanded: anchor !== undefined }}
        onPress={open}
        hitSlop={8}
        className="size-5 items-center justify-center rounded-full"
      >
        <Icon
          icon={Info}
          size={14}
          className={anchor ? "text-foreground" : "text-muted-foreground"}
        />
      </Pressable>
      <Modal
        transparent
        visible={anchor !== undefined}
        animationType="fade"
        onRequestClose={() => setAnchor(undefined)}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          className="flex-1"
          onPress={() => setAnchor(undefined)}
        >
          {anchor && (
            <View
              className="shell-inset absolute w-64 rounded-xl border border-border bg-popover px-3.5 py-3"
              style={{
                left: Math.max(16, Math.min(anchor.x, screenWidth - 256 - 16)),
                top: anchor.y,
                boxShadow: "0 10px 24px -12px rgba(10, 41, 71, 0.45)",
              }}
            >
              <Text className="text-[13px] text-foreground leading-relaxed">
                {children}
              </Text>
            </View>
          )}
        </Pressable>
      </Modal>
    </>
  );
}
