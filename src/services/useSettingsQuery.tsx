import { useQuery } from "@tanstack/react-query";
import { fetchGet } from "@/lib/fetch";
import { API_SETTINGS } from "@/const/apiUrls";
import { SETTINGS_KEY } from "@/const/queryKeys";
import { Settings } from "@/services/types/settings";

export const useSettingsQuery = () => {
  return useQuery<Settings>({
    queryKey: [SETTINGS_KEY],
    queryFn: async () => {
      const response = await fetchGet(API_SETTINGS);
      return response as Settings;
    },
  });
};
