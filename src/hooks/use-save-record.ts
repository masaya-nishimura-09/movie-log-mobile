import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { saveRecordAction } from "@/actions/record/save-record";

export function useSaveRecord(
  recordId: string | undefined,
  onSaved?: () => void,
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: unknown) => saveRecordAction(recordId, values),
    onSuccess: async (result) => {
      if (!result.success) return;
      await queryClient.invalidateQueries({ queryKey: ["records"] });
      if (recordId) router.dismissTo(`/records/${result.data}`);
      else router.navigate(`/records/${result.data}`);
      onSaved?.();
    },
  });
}
