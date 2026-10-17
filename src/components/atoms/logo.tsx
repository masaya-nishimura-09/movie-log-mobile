import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { wordmarkPath } from "@/components/atoms/logo-paths";
import { StampShapes } from "@/components/atoms/stamp-shapes";
import { useCssVariable } from "@/hooks/use-css-variable";

type LogoProps = {
  name: string;
  large?: boolean;
};

const aspectRatio = 634.9 / 110;

export function Logo({ name, large }: LogoProps) {
  const foreground = useCssVariable("--foreground");
  const background = useCssVariable("--background");
  const height = large ? 32 : 24;

  return (
    <View accessible accessibilityLabel={name} accessibilityRole="image">
      <Svg width={height * aspectRatio} height={height} viewBox="0 0 634.9 110">
        <StampShapes
          stampColor={foreground}
          cColor={background}
          playColor="#8b5e3c"
        />
        <Path d={wordmarkPath} fill={foreground} />
      </Svg>
    </View>
  );
}
