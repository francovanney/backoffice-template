import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDelete } from "@/lib/fetch";
import { SPOTS_KEY } from "@/const/queryKeys";
import { API_SPOTS_DELETE_URL } from "@/const/apiUrls";

interface DeleteSpotResponse {
  success: boolean;
  message: string;
}

const useDeleteSpotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteSpotResponse,
    Error,
    { id: number; seccionPadre: string }
  >({
    mutationFn: async ({ id }) => {
      const response = await fetchDelete(`${API_SPOTS_DELETE_URL}${id}`);
      return response;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [SPOTS_KEY, { selectedSectionType: variables.seccionPadre }],
      });
    },
  });
};

export { useDeleteSpotMutation };
