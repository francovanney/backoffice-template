import { useMutation } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetch";
import { API_SPOTS_CREATE_URL } from "@/const/apiUrls";
import { Spot } from "@/services/types/spot";

export const createSpot = async (
  data: Record<string, unknown> | FormData
): Promise<Spot> => {
  return await fetchPost(API_SPOTS_CREATE_URL, data);
};

export function useCreateSpotMutation() {
  return useMutation({
    mutationFn: createSpot,
  });
}
