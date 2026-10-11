import { cssInterop } from "nativewind";
import type { ComponentProps } from "react";
import { SafeAreaView as SafeAreaViewBase } from "react-native-safe-area-context";

type SafeAreaViewProps = ComponentProps<typeof SafeAreaViewBase> & {
  className?: string;
};

export function SafeAreaView(props: SafeAreaViewProps) {
  return <SafeAreaViewBase {...props} />;
}

cssInterop(SafeAreaView, { className: "style" });
