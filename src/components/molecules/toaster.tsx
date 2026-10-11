import { CircleCheck } from "lucide-react-native";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/atoms/icon";
import { Text } from "@/components/atoms/text";
import { useCssVariable } from "@/hooks/use-css-variable";

type ToastItem = { id: number; title: string };

const toastDuration = 4000;
const topOffset = 68;

const ToastContext = createContext<(title: string) => void>(() => undefined);

export function useToast() {
  return useContext(ToastContext);
}

let sequence = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();
  const edgeColor = useCssVariable("--primary-edge");

  const show = useCallback((title: string) => {
    sequence += 1;
    const id = sequence;
    setToasts((current) => [...current, { id, title }]);
    setTimeout(
      () => setToasts((current) => current.filter((toast) => toast.id !== id)),
      toastDuration,
    );
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <View
        pointerEvents="none"
        className="shell-inset absolute inset-x-4 items-center gap-2"
        style={{ top: insets.top + topOffset }}
      >
        {toasts.map((toast) => (
          <View
            key={toast.id}
            className="flex-row items-center gap-2.5 rounded-2xl bg-primary px-4 py-3"
            style={{ boxShadow: `0 3px 0 0 ${edgeColor}` }}
          >
            <Icon
              icon={CircleCheck}
              size={20}
              className="text-primary-foreground"
            />
            <Text className="font-bold text-primary-foreground text-sm">
              {toast.title}
            </Text>
          </View>
        ))}
      </View>
    </ToastContext.Provider>
  );
}
