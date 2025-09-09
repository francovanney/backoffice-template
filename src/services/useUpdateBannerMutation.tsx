import { useMutation } from "@tanstack/react-query";
import { fetchPut } from "@/lib/fetch";
import { API_BANNERS_UPDATE_URL } from "@/const/apiUrls";

type UpdateBannerParams = {
  id: number | string;
  data: Record<string, unknown> | FormData;
};

export const updateBanner = async ({ id, data }: UpdateBannerParams) => {
  const url = `${API_BANNERS_UPDATE_URL}/${id}`;
  return await fetchPut(url, data);
};

export function useUpdateBannerMutation() {
  return useMutation({
    mutationFn: updateBanner,
  });
}
