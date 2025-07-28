import { useMutation } from "@tanstack/react-query";
import { fetchPost } from "@/lib/fetch";
import { API_SHOWS_CREATE_URL } from "@/const/apiUrls";

export const createShow = async (data: Record<string, unknown> | FormData) => {
  if (data instanceof FormData) {
    const token = import.meta.env.VITE_TOKEN_SECRET;
    const response = await fetch(API_SHOWS_CREATE_URL, {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw await response.json();
    return await response.json();
  }
  return await fetchPost(API_SHOWS_CREATE_URL, data);
};

export function useShowMutation() {
  return useMutation({
    mutationFn: createShow,
  });
}
