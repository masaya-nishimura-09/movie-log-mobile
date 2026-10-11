import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { cn } from "@/lib/style/cn";

type SearchFormProps = {
  label: string;
  placeholder: string;
  keyword: string;
  onSubmit: (keyword: string) => void;
  className?: string;
};

export function SearchForm({
  label,
  placeholder,
  keyword,
  onSubmit,
  className,
}: SearchFormProps) {
  const [value, setValue] = useState(keyword);

  useEffect(() => {
    setValue(keyword);
  }, [keyword]);

  return (
    <View
      className={cn(
        "h-10 flex-row items-center gap-2 rounded-full bg-field px-4",
        className,
      )}
    >
      <Icon icon={Search} size={18} className="text-placeholder" />
      <TextInput
        value={value}
        onChangeText={setValue}
        onSubmitEditing={() => onSubmit(value.trim())}
        accessibilityLabel={label}
        placeholder={placeholder}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        className="min-w-0 flex-1 p-0 font-sans text-foreground text-sm placeholder:text-placeholder"
      />
    </View>
  );
}
