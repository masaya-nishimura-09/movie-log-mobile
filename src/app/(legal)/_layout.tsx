import { Slot } from "expo-router";
import { CenteredCardScreen } from "@/components/organisms/centered-card-screen";

export default function LegalLayout() {
  return (
    <CenteredCardScreen cardClassName="max-w-3xl">
      <Slot />
    </CenteredCardScreen>
  );
}
