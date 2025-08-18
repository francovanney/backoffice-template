import { useQuery } from "@tanstack/react-query";
import { SPOTS_KEY } from "@/const/queryKeys";
import { API_SPOTS_URL } from "@/const/apiUrls";
import { fetchGet } from "@/lib/fetch";
import { Spot } from "@/services/types/spot";

const fetchSpots = async (selectedSectionType: string): Promise<Spot[]> => {
  const res = await fetchGet(`${API_SPOTS_URL}${selectedSectionType}`);
  return res as Spot[];
};

export function useSpotsQuery(selectedSectionType: string) {
  return useQuery({
    queryKey: [SPOTS_KEY, { selectedSectionType }],
    queryFn: () => fetchSpots(selectedSectionType),
    enabled: !!selectedSectionType,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
