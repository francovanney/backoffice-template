import { useMutation } from "@tanstack/react-query";
import { fetchDelete } from "@/lib/fetch";
import { API_BANNERS_DELETE_URL } from "@/const/apiUrls";

export const deleteBanners = async (id: number | string) => {
  const url = `${API_BANNERS_DELETE_URL}/${id}`;
  return await fetchDelete(url);
};

export function useDeleteBannerMutation() {
  return useMutation({
    mutationFn: deleteBanners,
  });
}
