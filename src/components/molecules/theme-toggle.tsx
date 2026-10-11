import { Moon, Sun } from "lucide-react-native";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { saveScheme } from "@/lib/theme/theme-storage";

type ThemeToggleProps = {
  label: string;
};

export function ThemeToggle({ label }: ThemeToggleProps) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const next = colorScheme === "dark" ? "light" : "dark";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={() => {
        setColorScheme(next);
        void saveScheme(next);
      }}
      className="size-9 items-center justify-center rounded-full active:bg-sidebar-accent"
    >
      <Icon
        icon={colorScheme === "dark" ? Sun : Moon}
        size={20}
        className="text-foreground-sub"
      />
    </Pressable>
  );
}
