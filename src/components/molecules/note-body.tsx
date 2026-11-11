import { Fragment, type ReactNode } from "react";
import { View } from "react-native";
import { Text } from "@/components/atoms/text";
import { cn } from "@/lib/style/cn";
import type { NoteNode } from "@/schemas/record/note";

const lineHeight = 32;

function fontFamily(node: NoteNode, bold: boolean): string {
  const marks = (node.marks ?? []).map((mark) => mark.type);
  const strong = bold || marks.includes("bold");
  const italic = marks.includes("italic");
  if (strong && italic) return "Poppins_700Bold_Italic";
  if (strong) return "Poppins_700Bold";
  if (italic) return "Poppins_400Regular_Italic";
  return "Poppins_400Regular";
}

function renderInline(node: NoteNode, bold: boolean): ReactNode {
  return (node.content ?? []).map((child, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: the nodes have no IDs and never reorder
    <Fragment key={index}>
      {child.type === "hardBreak" ? (
        "\n"
      ) : (
        <Text style={{ fontFamily: fontFamily(child, bold) }}>
          {child.text ?? ""}
        </Text>
      )}
    </Fragment>
  ));
}

function TextBlock({
  node,
  className,
  bold = false,
}: {
  node: NoteNode;
  className?: string;
  bold?: boolean;
}) {
  return (
    <Text
      className={cn("text-base text-foreground", className)}
      style={{ lineHeight }}
    >
      {node.content?.length ? renderInline(node, bold) : " "}
    </Text>
  );
}

function ListBlock({ node, ordered }: { node: NoteNode; ordered: boolean }) {
  return (
    <View>
      {(node.content ?? []).map((item, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: the nodes have no IDs and never reorder
        <View key={index} className="flex-row">
          <Text
            className="w-6 text-base text-foreground"
            style={{ lineHeight }}
          >
            {ordered ? `${index + 1}.` : "•"}
          </Text>
          <View className="min-w-0 flex-1">
            <Blocks nodes={item.content ?? []} spaced={false} />
          </View>
        </View>
      ))}
    </View>
  );
}

function Block({ node }: { node: NoteNode }) {
  switch (node.type) {
    case "paragraph":
      return <TextBlock node={node} />;
    case "heading":
      return (
        <TextBlock
          node={node}
          bold
          className={node.attrs?.level === 3 ? "text-lg" : "text-xl"}
        />
      );
    case "bulletList":
      return <ListBlock node={node} ordered={false} />;
    case "orderedList":
      return <ListBlock node={node} ordered />;
    case "blockquote":
      return (
        <View className="border-input border-l-4 pl-4">
          <Blocks nodes={node.content ?? []} quote />
        </View>
      );
    default:
      return <Blocks nodes={node.content ?? []} />;
  }
}

function Blocks({
  nodes,
  spaced = true,
  quote = false,
}: {
  nodes: NoteNode[];
  spaced?: boolean;
  quote?: boolean;
}) {
  return nodes.map((node, index) => {
    const previous = nodes[index - 1];
    const gap = spaced && previous && previous.type !== "heading";
    return (
      <View
        // biome-ignore lint/suspicious/noArrayIndexKey: the nodes have no IDs and never reorder
        key={index}
        className={cn(gap && "mt-8")}
      >
        {quote && node.type === "paragraph" ? (
          <TextBlock node={node} className="text-foreground-sub" />
        ) : (
          <Block node={node} />
        )}
      </View>
    );
  });
}

export function NoteBody({ content }: { content: NoteNode }) {
  return (
    <View>
      <Blocks nodes={content.content ?? []} />
    </View>
  );
}
