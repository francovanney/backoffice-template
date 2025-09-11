import { useMutation } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetch";
import { API_BANNERS_URL } from "@/const/apiUrls";

export const createBanner = async (data: Record<string, unknown> | FormData) => {
  return await fetchPost(API_BANNERS_URL, data);
};

export function useCreateBannerMutation() {
  return useMutation({
    mutationFn: createBanner,
  });
}
