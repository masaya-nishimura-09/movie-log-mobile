import {
  BlockquoteBridge,
  BoldBridge,
  BulletListBridge,
  CoreBridge,
  HardBreakBridge,
  HeadingBridge,
  HistoryBridge,
  ItalicBridge,
  ListItemBridge,
  OrderedListBridge,
  RichText,
  useBridgeState,
  useEditorBridge,
} from "@10play/tentap-editor";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  type LucideIcon,
  Quote,
} from "lucide-react-native";
import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { useCssVariable } from "@/hooks/use-css-variable";
import type { Dictionary } from "@/i18n/get-dictionary";
import { cn } from "@/lib/style/cn";
import type { Note } from "@/schemas/record/note";

type NoteEditorProps = {
  defaultValue?: Note;
  onChange: (note: Note) => void;
  dict: Dictionary["noteEditor"];
  invalid?: boolean;
};

type Tool = {
  key: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  run: () => void;
};

function editorCss(colors: { text: string; sub: string; rule: string }) {
  return `
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,700;1,400;1,700&display=swap");
html, body { background: transparent; }
#root .ProseMirror,
#root div.dynamic-height .ProseMirror {
  box-sizing: border-box;
  min-height: 256px;
  padding: 12px 14px;
  outline: none;
  font-family: Poppins, -apple-system, "Hiragino Sans", sans-serif;
  font-size: 16px;
  line-height: 2;
  color: ${colors.text};
  overflow-wrap: break-word;
}
.ProseMirror > :first-child { margin-top: 0; }
.ProseMirror > :last-child { margin-bottom: 0; }
.ProseMirror p { margin: 0 0 24px; }
.ProseMirror h2 { margin: 40px 0 16px; font-size: 20px; font-weight: 700; }
.ProseMirror h3 { margin: 32px 0 12px; font-size: 18px; font-weight: 700; }
.ProseMirror ul, .ProseMirror ol { margin: 0 0 24px; padding-left: 24px; }
.ProseMirror ul { list-style: disc; }
.ProseMirror ol { list-style: decimal; }
.ProseMirror li > p { margin-bottom: 4px; }
.ProseMirror li ul, .ProseMirror li ol { margin-bottom: 0; }
.ProseMirror blockquote {
  margin: 0 0 24px;
  padding-left: 16px;
  border-left: 4px solid ${colors.rule};
  color: ${colors.sub};
}
.ProseMirror blockquote > p:last-child { margin-bottom: 0; }
`;
}

export function NoteEditor({
  defaultValue,
  onChange,
  dict,
  invalid = false,
}: NoteEditorProps) {
  const text = useCssVariable("--foreground");
  const sub = useCssVariable("--foreground-sub");
  const rule = useCssVariable("--input");

  const editor = useEditorBridge({
    initialContent: defaultValue,
    dynamicHeight: true,
    mergeStyles: true,
    bridgeExtensions: [
      CoreBridge,
      BoldBridge,
      ItalicBridge,
      HeadingBridge,
      BulletListBridge,
      OrderedListBridge,
      ListItemBridge,
      BlockquoteBridge,
      HardBreakBridge,
      HistoryBridge,
    ],
    onChange: () => {
      editor.getJSON().then((json) => onChange(json as Note));
    },
  });
  const state = useBridgeState(editor);

  useEffect(() => {
    if (state.isReady) {
      editor.injectCSS(editorCss({ text, sub, rule }), "note-editor");
    }
  }, [editor, state.isReady, text, sub, rule]);

  const tools: Tool[] = [
    {
      key: "bold",
      label: dict.bold,
      icon: Bold,
      active: state.isBoldActive,
      run: () => editor.toggleBold(),
    },
    {
      key: "italic",
      label: dict.italic,
      icon: Italic,
      active: state.isItalicActive,
      run: () => editor.toggleItalic(),
    },
    {
      key: "heading",
      label: dict.heading,
      icon: Heading2,
      active: state.headingLevel === 2,
      run: () => editor.toggleHeading(2),
    },
    {
      key: "subheading",
      label: dict.subheading,
      icon: Heading3,
      active: state.headingLevel === 3,
      run: () => editor.toggleHeading(3),
    },
    {
      key: "bulletList",
      label: dict.bulletList,
      icon: List,
      active: state.isBulletListActive,
      run: () => editor.toggleBulletList(),
    },
    {
      key: "orderedList",
      label: dict.orderedList,
      icon: ListOrdered,
      active: state.isOrderedListActive,
      run: () => editor.toggleOrderedList(),
    },
    {
      key: "blockquote",
      label: dict.blockquote,
      icon: Quote,
      active: state.isBlockquoteActive,
      run: () => editor.toggleBlockquote(),
    },
  ];

  return (
    <View
      className={cn(
        "overflow-hidden rounded-lg border border-transparent",
        state.isFocused ? "border-selected-border bg-card" : "bg-field",
        invalid && "border-destructive",
      )}
    >
      <View
        accessibilityRole="toolbar"
        accessibilityLabel={dict.toolbar}
        className="flex-row flex-wrap gap-0.5 border-input border-b border-dashed px-1.5 py-1.5"
      >
        {tools.map((tool) => (
          <Pressable
            key={tool.key}
            accessibilityRole="button"
            accessibilityLabel={tool.label}
            accessibilityState={{ selected: tool.active }}
            onPress={tool.run}
            className={cn(
              "size-8 items-center justify-center rounded-md active:bg-secondary",
              tool.active && "bg-secondary",
            )}
          >
            <Icon
              icon={tool.icon}
              size={18}
              className={
                tool.active ? "text-foreground" : "text-foreground-sub"
              }
            />
          </Pressable>
        ))}
      </View>
      <View>
        <RichText
          editor={editor}
          accessibilityLabel={dict.body}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    </View>
  );
}
