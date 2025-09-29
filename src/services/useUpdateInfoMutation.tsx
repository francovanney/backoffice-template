import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPut } from "@/lib/fetch";
import { API_INFO_URL } from "@/const/apiUrls";
import { INFO_KEY } from "@/const/queryKeys";
import type { Info } from "@/services/types/info";

type UpdateInfoParams = {
  data: Partial<Omit<Info, "id">>; // solo campos editables
};

export const updateInfo = async ({ data }: UpdateInfoParams) => {
  const url = `${API_INFO_URL}`;
  // Si tu fetchPut ya agrega Authorization, listo.
  // Si no, podés extender fetchPut o crear fetchPutAuth.
  return await fetchPut(url, data);
};

export function useUpdateInfoMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateInfo,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [INFO_KEY] });
    },
  });
}
