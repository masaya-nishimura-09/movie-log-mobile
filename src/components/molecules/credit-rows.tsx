import { MinusCircle, Plus } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { Icon } from "@/components/atoms/icon";
import { Input } from "@/components/atoms/input";
import { Text } from "@/components/atoms/text";
import { Select } from "@/components/molecules/select";
import { type CreditRow, newCreditRow } from "@/lib/record/record-form-state";
import { type CreditRole, creditRoleSchema } from "@/schemas/record/enums";

type CreditRowsProps = {
  rows: CreditRow[];
  onChange: (rows: CreditRow[]) => void;
  roleLabels: Record<CreditRole, string>;
  roleLabel: string;
  namePlaceholder: string;
  addLabel: string;
  removeLabel: string;
  closeLabel: string;
};

export function CreditRows({
  rows,
  onChange,
  roleLabels,
  roleLabel,
  namePlaceholder,
  addLabel,
  removeLabel,
  closeLabel,
}: CreditRowsProps) {
  const items = creditRoleSchema.options.map((role) => ({
    value: role,
    label: roleLabels[role],
  }));

  const update = (key: string, patch: Partial<CreditRow>) =>
    onChange(rows.map((row) => (row.key === key ? { ...row, ...patch } : row)));

  return (
    <View className="gap-2">
      {rows.map((row) => (
        <View key={row.key} className="flex-row flex-wrap items-center gap-2">
          <Select
            items={items}
            value={row.creditRole}
            label={roleLabel}
            closeLabel={closeLabel}
            className="w-32 shrink-0"
            onValueChange={(value) => {
              const parsed = creditRoleSchema.safeParse(value);
              if (parsed.success) update(row.key, { creditRole: parsed.data });
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={removeLabel}
            onPress={() => onChange(rows.filter((r) => r.key !== row.key))}
            className="ml-auto size-11 shrink-0 items-center justify-center"
          >
            <Icon
              icon={MinusCircle}
              size={20}
              className="text-muted-foreground"
            />
          </Pressable>
          <Input
            value={row.personName}
            maxLength={100}
            placeholder={namePlaceholder}
            onChangeText={(personName) => update(row.key, { personName })}
            className="w-full"
          />
        </View>
      ))}
      <Pressable
        accessibilityRole="button"
        onPress={() =>
          onChange([
            ...rows,
            newCreditRow(rows[rows.length - 1]?.creditRole ?? "director"),
          ])
        }
        className="h-9.5 flex-row items-center gap-1.5 self-start px-3.5"
      >
        <Icon icon={Plus} size={16} className="text-primary" />
        <Text className="font-medium text-primary text-sm">{addLabel}</Text>
      </Pressable>
    </View>
  );
}
