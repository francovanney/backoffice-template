import { useQuery } from "@tanstack/react-query";
import { SHOWS_KEY } from "@/const/queryKeys";
import { API_SHOWS_URL } from "@/const/apiUrls";
import { fetchGet } from "@/lib/fetch";
import { Event } from "@/services/types/event";

interface IPaginatedShows {
  data: Event[];
}

export function useShowsQuery(search?: string | null) {
  return useQuery<Event[]>({
    queryKey: [SHOWS_KEY, search],
    queryFn: async () => {
      const searchParam = search ? `?search=${encodeURIComponent(search)}` : "";
      const res: Event[] | IPaginatedShows = await fetchGet(
        `${API_SHOWS_URL}${searchParam}`
      );
      if (Array.isArray(res)) return res;
      if (res && Array.isArray(res.data)) return res.data;
      return [];
    },
  });
}
