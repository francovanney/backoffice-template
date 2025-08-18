import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetch";
import { API_URL } from "@/const/apiUrls";

interface CreateSectionRequest {
  nombre: string;
  seccion_padre: string;
}

interface CreateSectionResponse {
  id: number;
  nombre: string;
  seccion_padre: string;
  created_at: string;
  updated_at: string;
}

const useCreateSectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateSectionResponse, Error, CreateSectionRequest>({
    mutationFn: async (data: CreateSectionRequest) => {
      const response = await fetchPost(
        `${API_URL}/secciones`,
        data as unknown as Record<string, unknown>
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

export { useCreateSectionMutation };
export type { CreateSectionRequest, CreateSectionResponse };
