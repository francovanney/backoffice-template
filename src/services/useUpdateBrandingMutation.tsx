import { useMutation } from "@tanstack/react-query";
import { fetchPut } from "@/lib/fetch";
import { API_BRANDING } from "@/const/apiUrls";

type UpdateBrandingParams = {
  data: FormData;
};

export const updateBranding = async ({ data }: UpdateBrandingParams) => {
  const url = `${API_BRANDING}`;
  return await fetchPut(url, data);
};

export function useUpdateBrandingMutation() {
  return useMutation({
    mutationFn: updateBranding,
  });
}
