import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPut } from "@/lib/fetch";
import { API_URL } from "@/const/apiUrls";

interface UpdateSectionRequest {
  id: number;
  nombre: string;
  seccion_order: number;
  seccion_padre: string;
}

interface UpdateSectionResponse {
  id: number;
  nombre: string;
  seccion_order: number;
  seccion_padre: string;
  updated_at: string;
}

const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateSectionResponse, Error, UpdateSectionRequest>({
    mutationFn: async (data: UpdateSectionRequest) => {
      const { id, ...updateData } = data;
      const response = await fetchPut(
        `${API_URL}/secciones/${id}`,
        updateData as unknown as Record<string, unknown>
      );
      return response;
    },
    onSuccess: (_data, variables) => {
      // Invalidar la query de secciones para actualizar la lista
      queryClient.invalidateQueries({
        queryKey: ["sections", variables.seccion_padre],
      });
    },
  });
};

export { useUpdateSectionMutation };
export type { UpdateSectionRequest, UpdateSectionResponse };
