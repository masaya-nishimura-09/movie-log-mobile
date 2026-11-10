import { useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { MaskingTape } from "@/components/atoms/masking-tape";
import { Text } from "@/components/atoms/text";
import { NoteBody } from "@/components/molecules/note-body";
import { useCssVariable } from "@/hooks/use-css-variable";
import type { NoteNode } from "@/schemas/record/note";

const collapsedHeight = 256;
const lineHeight = 32;

type NoteSheetProps = {
  content: NoteNode;
  readMoreLabel: string;
  showLessLabel: string;
};

function FadeOut() {
  const card = useCssVariable("--card");

  return (
    <View pointerEvents="none" className="absolute inset-x-0 bottom-0 h-16">
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="note-fade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={card} stopOpacity={0} />
            <Stop offset="1" stopColor={card} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#note-fade)" />
      </Svg>
    </View>
  );
}

export function NoteSheet({
  content,
  readMoreLabel,
  showLessLabel,
}: NoteSheetProps) {
  const [bodyHeight, setBodyHeight] = useState<number>();
  const [expanded, setExpanded] = useState(false);
  const overflows =
    bodyHeight === undefined ? undefined : bodyHeight > collapsedHeight + 1;
  const collapsed = overflows !== false && !expanded;
  const lines = Math.ceil((bodyHeight ?? collapsedHeight) / lineHeight);

  return (
    <View
      className="relative rounded-[3px] bg-card px-5.5 pt-5 pb-3"
      style={{ boxShadow: "0 6px 14px -8px rgba(10, 41, 71, 0.45)" }}
    >
      <MaskingTape />
      <View
        className="relative overflow-hidden"
        style={collapsed ? { maxHeight: collapsedHeight } : undefined}
      >
        <View pointerEvents="none" className="absolute inset-x-0 top-0">
          {Array.from({ length: lines }, (_, index) => (
            <View
              // biome-ignore lint/suspicious/noArrayIndexKey: the lines are identical and never reorder
              key={index}
              className="h-8 border-input border-b"
            />
          ))}
        </View>
        <View
          onLayout={(event) => setBodyHeight(event.nativeEvent.layout.height)}
        >
          <NoteBody content={content} />
        </View>
        {collapsed && overflows && <FadeOut />}
      </View>
      {overflows && (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((value) => !value)}
          className="mt-1 h-8 justify-center self-start"
        >
          <Text className="font-bold text-primary text-sm">
            {expanded ? showLessLabel : readMoreLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
