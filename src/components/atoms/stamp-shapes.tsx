import { Circle, Path } from "react-native-svg";
import { cPath, playPath, stampPath } from "@/components/atoms/logo-paths";

type StampShapesProps = {
  stampColor: string;
  cColor: string;
  playColor: string;
};

export function StampShapes({
  stampColor,
  cColor,
  playColor,
}: StampShapesProps) {
  return (
    <>
      <Path d={stampPath} fill={stampColor} />
      <Path d={cPath} fill={cColor} />
      <Circle cx="71.385" cy="39.573" r="4.5" fill={cColor} />
      <Circle cx="71.385" cy="70.427" r="4.5" fill={cColor} />
      <Path d={playPath} fill={playColor} />
    </>
  );
}
