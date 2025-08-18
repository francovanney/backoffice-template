import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchDelete } from "@/lib/fetch";
import { API_URL } from "@/const/apiUrls";

interface DeleteSectionResponse {
  success: boolean;
  message: string;
}

const useDeleteSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DeleteSectionResponse,
    Error,
    { id: number; sectionParent: string }
  >({
    mutationFn: async ({ id }) => {
      const response = await fetchDelete(`${API_URL}/secciones/${id}`);
      return response;
    },
    onSuccess: (_data, variables) => {
      // Invalidar la query de secciones para actualizar la lista
      queryClient.invalidateQueries({
        queryKey: ["sections", variables.sectionParent],
      });
    },
  });
};

export { useDeleteSectionMutation };
export type { DeleteSectionResponse };
