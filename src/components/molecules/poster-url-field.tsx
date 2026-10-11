import * as ImagePicker from "expo-image-picker";
import { Upload } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import type { ActionResult } from "@/actions/action-result";
import type { PosterFile } from "@/api/media/upload-poster";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Text } from "@/components/atoms/text";

type PosterUrlFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  upload: (
    file: PosterFile & { size?: number },
  ) => Promise<ActionResult<string>>;
  uploadLabel: string;
  uploadingLabel: string;
  errorLabel: string;
  invalid?: boolean;
};

export function PosterUrlField({
  value,
  onValueChange,
  placeholder,
  upload,
  uploadLabel,
  uploadingLabel,
  errorLabel,
  invalid,
}: PosterUrlFieldProps) {
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState(false);

  const pick = async () => {
    const picked = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
    });
    const asset = picked.assets?.[0];
    if (picked.canceled || !asset) return;
    setPending(true);
    const result = await upload({
      uri: asset.uri,
      name: asset.fileName ?? "poster",
      type: asset.mimeType ?? "image/jpeg",
      size: asset.fileSize,
    });
    setPending(false);
    setFailed(!result.success);
    if (result.success) onValueChange(result.data);
  };

  return (
    <View className="gap-2">
      <Input
        value={value}
        onChangeText={onValueChange}
        placeholder={placeholder}
        keyboardType="url"
        autoCapitalize="none"
        autoCorrect={false}
        invalid={invalid}
      />
      <Button variant="outline" icon={Upload} disabled={pending} onPress={pick}>
        {pending ? uploadingLabel : uploadLabel}
      </Button>
      {failed && (
        <Text
          accessibilityRole="alert"
          className="text-destructive-foreground text-xs"
        >
          {errorLabel}
        </Text>
      )}
    </View>
  );
}
