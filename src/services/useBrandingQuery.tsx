import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/lib/fetch";
import { API_BRANDING } from "@/const/apiUrls";
import { BRANDING_KEY } from "@/const/queryKeys";
import { Branding } from "@/services/types/branding";

export const getBranding = async (): Promise<Branding> => {
  const url = `${API_BRANDING}`;
  return await fetchGet(url);
};

export function useBrandingQuery() {
  return useQuery({
    queryKey: [BRANDING_KEY],
    queryFn: getBranding,
  });
}
