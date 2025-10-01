import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/lib/fetch";
import { API_INFO_URL } from "@/const/apiUrls";
import { INFO_KEY } from "@/const/queryKeys";
import { Info } from "@/services/types/info";

export const useInfoQuery = () => {
  return useQuery<Info>({
    queryKey: [INFO_KEY],
    queryFn: async () => {
      const response = await fetchGet(API_INFO_URL);
      return response as Info;
    },
  });
};
