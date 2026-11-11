import { useQuery } from "@tanstack/react-query";
import { getRecordAttachments } from "@/api/record/get-record-attachments";

export function useRecordAttachments(recordId: string) {
  return useQuery({
    queryKey: ["records", "attachments", recordId],
    queryFn: () => getRecordAttachments(recordId),
  });
}
