import { useMutation } from "@tanstack/react-query";
import { fetchPut } from "@/lib/fetch";
import { API_COLORS } from "@/const/apiUrls";
import { Colors } from "@/services/types/colors";

type UpdateColorsParams = {
  data: Partial<Omit<Colors, "id">>;
};

export const updateColors = async ({ data }: UpdateColorsParams) => {
  const url = `${API_COLORS}`;
  return await fetchPut(url, data);
};

export function useUpdateColorsMutation() {
  return useMutation({
    mutationFn: updateColors,
  });
}
