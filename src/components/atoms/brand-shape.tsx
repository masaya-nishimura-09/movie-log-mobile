import { useId } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import Svg, { Ellipse, G, Mask, Path, Polygon, Rect } from "react-native-svg";
import type { markShapes } from "@/components/atoms/logo-shapes";

type BrandShapeProps = {
  shapes: typeof markShapes;
  ringColor: string;
  glyphColor: string;
  ringOpacity?: number;
  glyphOpacity?: number;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

export function BrandShape({
  shapes,
  ringColor,
  glyphColor,
  ringOpacity,
  glyphOpacity,
  label,
  style,
}: BrandShapeProps) {
  const maskId = `brand-mask-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [x, y, width, height] = shapes.maskBox;

  return (
    <View
      style={style}
      accessible={label !== undefined}
      accessibilityLabel={label}
      accessibilityRole={label === undefined ? undefined : "image"}
    >
      <Svg viewBox={shapes.viewBox} width="100%" height="100%">
        <G transform={shapes.transform}>
          <Mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={x}
            y={y}
            width={width}
            height={height}
          >
            <Rect x={x} y={y} width={width} height={height} fill="#fff" />
            {shapes.maskPolygons.map(([points, fill]) => (
              <Polygon key={points} points={points} fill={fill} />
            ))}
          </Mask>
          <Path
            mask={`url(#${maskId})`}
            fillRule="evenodd"
            d={shapes.ring}
            fill={ringColor}
            fillOpacity={ringOpacity}
          />
          <Ellipse
            cx={shapes.dot.cx}
            cy={shapes.dot.cy}
            rx={shapes.dot.rx}
            ry={shapes.dot.ry}
            transform={shapes.dot.transform}
            fill={ringColor}
            fillOpacity={ringOpacity}
          />
        </G>
        <Path d={shapes.glyph} fill={glyphColor} fillOpacity={glyphOpacity} />
      </Svg>
    </View>
  );
}
