import type { LucideIcon, LucideProps } from "lucide-react-native";
import { cssInterop } from "nativewind";

type IconProps = LucideProps & { icon: LucideIcon; className?: string };

export function Icon({ icon: Component, ...props }: IconProps) {
  return <Component {...props} />;
}

cssInterop(Icon, {
  className: { target: "style", nativeStyleToProp: { color: true } },
});
