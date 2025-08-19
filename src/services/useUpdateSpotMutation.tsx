import { useMutation } from "@tanstack/react-query";
import { fetchPut } from "@/lib/fetch";
import { API_SPOTS_UPDATE_URL } from "@/const/apiUrls";
import { Spot } from "@/services/types/spot";

type UpdateSpotParams = {
  id: number;
  data: Record<string, unknown> | FormData;
};

export const updateSpot = async ({
  id,
  data,
}: UpdateSpotParams): Promise<Spot> => {
  const url = `${API_SPOTS_UPDATE_URL}${id}`;
  return await fetchPut(url, data);
};

export function useUpdateSpotMutation() {
  return useMutation({
    mutationFn: updateSpot,
  });
}
