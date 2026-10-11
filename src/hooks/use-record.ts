import { useQuery } from "@tanstack/react-query";
import { getRecord } from "@/api/record/get-record";

export function useRecord(recordId: string) {
  return useQuery({
    queryKey: ["records", "detail", recordId],
    queryFn: () => getRecord(recordId),
  });
}
