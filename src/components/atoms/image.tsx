import { Image as ImageBase } from "expo-image";
import { cssInterop } from "nativewind";
import type { ComponentProps } from "react";

type ImageProps = ComponentProps<typeof ImageBase> & { className?: string };

export function Image(props: ImageProps) {
  return <ImageBase {...props} />;
}

cssInterop(Image, { className: "style" });
