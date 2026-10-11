import { Slot } from "expo-router";
import { CenteredCardScreen } from "@/components/organisms/centered-card-screen";

export default function AuthLayout() {
  return (
    <CenteredCardScreen cardClassName="max-w-111">
      <Slot />
    </CenteredCardScreen>
  );
}
