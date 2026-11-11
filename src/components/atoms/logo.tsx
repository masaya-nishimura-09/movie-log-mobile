import { BrandShape } from "@/components/atoms/brand-shape";
import { wordmarkShapes } from "@/components/atoms/logo-shapes";
import { useCssVariable } from "@/hooks/use-css-variable";

type LogoProps = {
  name: string;
  large?: boolean;
};

const aspectRatio = 460 / 150;

export function Logo({ name, large }: LogoProps) {
  const ring = useCssVariable("--logo-ring");
  const foreground = useCssVariable("--foreground");
  const height = large ? 72 : 32;

  return (
    <BrandShape
      shapes={wordmarkShapes}
      ringColor={ring}
      glyphColor={foreground}
      label={name}
      style={{ height, width: height * aspectRatio }}
    />
  );
}
