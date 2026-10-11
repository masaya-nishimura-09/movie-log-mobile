import { useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "@/components/atoms/text";
import { CountedInput } from "@/components/molecules/counted-input";
import type { MovieSuggestion } from "@/schemas/movie/movie";

const searchDelay = 300;
const minQueryLength = 2;

type MovieTitleFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  search: (title: string) => Promise<MovieSuggestion[]>;
  onSelect: (movieId: string) => void;
  maxLength: number;
  counterTemplate: string;
  invalid?: boolean;
};

export function MovieTitleField({
  value,
  onValueChange,
  search,
  onSelect,
  maxLength,
  counterTemplate,
  invalid,
}: MovieTitleFieldProps) {
  const [suggestions, setSuggestions] = useState<MovieSuggestion[]>([]);
  const [typed, setTyped] = useState(false);
  const latest = useRef(0);

  useEffect(() => {
    const query = value.trim();
    if (!typed || query.length < minQueryLength) {
      setSuggestions([]);
      return;
    }
    const request = ++latest.current;
    const timer = setTimeout(async () => {
      const result = await search(query);
      if (request !== latest.current) return;
      setSuggestions(result);
    }, searchDelay);
    return () => clearTimeout(timer);
  }, [value, typed, search]);

  const close = () => {
    latest.current++;
    setTyped(false);
    setSuggestions([]);
  };

  const choose = (suggestion: MovieSuggestion) => {
    close();
    onSelect(suggestion.movieId);
  };

  return (
    <View className="gap-1">
      <CountedInput
        value={value}
        maxLength={maxLength}
        counterTemplate={counterTemplate}
        invalid={invalid}
        autoCorrect={false}
        onChangeText={(text) => {
          setTyped(true);
          onValueChange(text);
        }}
      />
      {suggestions.length > 0 && (
        <View className="rounded-lg border border-border bg-card p-1">
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion.movieId}
              accessibilityRole="button"
              onPress={() => choose(suggestion)}
              className="gap-0.5 rounded-md px-3 py-2 active:bg-accent"
            >
              <Text className="text-foreground text-sm">
                {suggestion.title}
                {suggestion.releaseYear ? `  ${suggestion.releaseYear}` : ""}
              </Text>
              {suggestion.originalTitle !== suggestion.title && (
                <Text className="text-muted-foreground text-xs">
                  {suggestion.originalTitle}
                </Text>
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
