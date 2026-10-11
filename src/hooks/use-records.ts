import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecords } from "@/api/record/get-records";
import type { RecordQuery } from "@/schemas/record/list";

export function useRecords(query: RecordQuery) {
  return useQuery({
    queryKey: ["records", "list", query],
    queryFn: () => getRecords(query),
    placeholderData: keepPreviousData,
  });
}
