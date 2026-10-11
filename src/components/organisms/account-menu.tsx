import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { LogOut, type LucideIcon, UserRound } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { logoutAction } from "@/actions/auth/logout";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import type { Dictionary } from "@/i18n/get-dictionary";

type AccountMenuProps = {
  username: string;
  dict: Dictionary["header"];
};

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="h-10 flex-row items-center gap-2 rounded-md px-1.5 active:bg-accent"
    >
      <Icon icon={icon} size={16} className="text-popover-foreground" />
      <Text className="font-medium text-popover-foreground text-sm">
        {label}
      </Text>
    </Pressable>
  );
}

export function AccountMenu({ username, dict }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();

  const logout = async () => {
    setOpen(false);
    await logoutAction();
    queryClient.clear();
    router.replace("/login");
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={dict.accountMenu}
        onPress={() => setOpen(true)}
        className="size-9 items-center justify-center rounded-full bg-mood"
      >
        <Text className="font-medium text-[13px] text-mood-foreground">
          {Array.from(username)[0] ?? ""}
        </Text>
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1" onPress={() => setOpen(false)}>
          <View
            className="shell-inset absolute right-3 w-52 rounded-xl border border-border bg-popover p-1"
            style={{ top: insets.top + 56 }}
          >
            <Text
              numberOfLines={1}
              className="px-1.5 py-1.5 font-bold text-popover-foreground text-sm"
            >
              {username}
            </Text>
            <View className="my-1 h-px bg-border" />
            <MenuItem
              icon={UserRound}
              label={dict.account}
              onPress={() => {
                setOpen(false);
                router.navigate("/account");
              }}
            />
            <MenuItem icon={LogOut} label={dict.logout} onPress={logout} />
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
