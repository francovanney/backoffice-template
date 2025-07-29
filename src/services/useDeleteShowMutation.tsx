import { useMutation } from "@tanstack/react-query";
import { fetchDelete } from "@/lib/fetch";
import { API_SHOWS_DELETE_URL } from "@/const/apiUrls";

export const deleteShow = async (id: number | string) => {
  const url = `${API_SHOWS_DELETE_URL}/${id}`;
  return await fetchDelete(url);
};

export function useDeleteShowMutation() {
  return useMutation({
    mutationFn: deleteShow,
  });
}
