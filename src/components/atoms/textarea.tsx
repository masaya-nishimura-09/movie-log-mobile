import { TextInput, type TextInputProps } from "react-native";
import { cn } from "@/lib/style/cn";

type TextareaProps = TextInputProps & {
  className?: string;
  invalid?: boolean;
};

export function Textarea({ className, invalid, ...props }: TextareaProps) {
  return (
    <TextInput
      multiline
      textAlignVertical="top"
      className={cn(
        "min-h-16 w-full rounded-lg border border-transparent bg-field px-3.5 py-3 font-sans text-[15px] text-foreground leading-loose placeholder:text-placeholder focus:border-selected-border focus:bg-card",
        invalid && "border-destructive",
        className,
      )}
      {...props}
    />
  );
}
