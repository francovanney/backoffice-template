import { useMutation } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetch";
import { API_SHOWS_CREATE_URL } from "@/const/apiUrls";

export const createShow = async (data: Record<string, unknown> | FormData) => {
  return await fetchPost(API_SHOWS_CREATE_URL, data);
};

export function useCreateShowMutation() {
  return useMutation({
    mutationFn: createShow,
  });
}
