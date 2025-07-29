import { useMutation } from "@tanstack/react-query";
import { fetchPut } from "@/lib/fetch";
import { API_SHOWS_UPDATE_URL } from "@/const/apiUrls";

type UpdateShowParams = {
  id: number | string;
  data: Record<string, unknown> | FormData;
};

export const updateShow = async ({ id, data }: UpdateShowParams) => {
  const url = `${API_SHOWS_UPDATE_URL}/${id}`;
  return await fetchPut(url, data);
};

export function useUpdateShowMutation() {
  return useMutation({
    mutationFn: updateShow,
  });
}
