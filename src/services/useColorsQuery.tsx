import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/lib/fetch";
import { API_COLORS } from "@/const/apiUrls";
import { COLORS_KEY } from "@/const/queryKeys";
import { Colors } from "@/services/types/colors";

export const useColorsQuery = () => {
  return useQuery<Colors>({
    queryKey: [COLORS_KEY],
    queryFn: async () => {
      const response = await fetchGet(API_COLORS);
      return response as Colors;
    },
  });
};
