import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/style/cn";

type InputProps = TextInputProps & {
  className?: string;
  invalid?: boolean;
};

export function Input({ className, invalid, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        "h-11 w-full rounded-lg border border-transparent bg-field px-3.5 font-sans text-[15px] text-foreground placeholder:text-placeholder focus:border-selected-border focus:bg-card",
        invalid && "border-destructive",
        className,
      )}
      {...props}
    />
  );
}
