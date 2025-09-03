import { useMutation } from "@tanstack/react-query";
import { fetchPut } from "@/lib/fetch";
import { API_SETTINGS } from "@/const/apiUrls";
import { Settings } from "@/services/types/settings";

type UpdateSettingsParams = {
  data: Partial<Omit<Settings, "id">>;
};

export const updateSettings = async ({ data }: UpdateSettingsParams) => {
  const url = `${API_SETTINGS}`;
  return await fetchPut(url, data);
};

export function useUpdateSettingsMutation() {
  return useMutation({
    mutationFn: updateSettings,
  });
}
