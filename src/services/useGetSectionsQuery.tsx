import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/lib/fetch";
import { API_SECTIONS_URL } from "@/const/apiUrls";

export interface Seccion {
  id: number;
  nombre: string;
  seccion_order: number;
  seccion_padre: string;
}

export const useGetSectionsQuery = (sectionType: string) => {
  return useQuery<Seccion[]>({
    queryKey: ["sections", sectionType],
    queryFn: async () => {
      const response = await fetchGet(`${API_SECTIONS_URL}${sectionType}`);
      return response || [];
    },
    enabled: !!sectionType,
  });
};
