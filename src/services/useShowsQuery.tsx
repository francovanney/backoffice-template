import { useQuery } from "@tanstack/react-query";
import { SHOWS_KEY } from "@/const/queryKeys";
import { API_SHOWS_URL } from "@/const/apiUrls";
import { fetchGet } from "@/lib/fetch";
import { IShow, IPaginatedShows } from "@/services/interfaces/IShow";

export function useShowsQuery() {
  return useQuery<IShow[]>({
    queryKey: [SHOWS_KEY],
    queryFn: async () => {
      const res: IShow[] | IPaginatedShows = await fetchGet(API_SHOWS_URL);
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    },
  });
}
