import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "color_scheme";

export type StoredScheme = "light" | "dark";

export async function loadScheme(): Promise<StoredScheme | undefined> {
  const value = await AsyncStorage.getItem(key);
  return value === "light" || value === "dark" ? value : undefined;
}

export async function saveScheme(scheme: StoredScheme): Promise<void> {
  await AsyncStorage.setItem(key, scheme);
}
