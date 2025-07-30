import { refreshToken, getValidToken } from "./tokenManager";

async function fetchWithAuth(
  url: string,
  method: string = "GET",
  body: Record<string, unknown> | FormData | null = null
) {
  try {
    let token = await getValidToken();

    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = {};

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (body) {
      config.body = isFormData ? body : JSON.stringify(body);
    }

    const response = await fetch(url, config);

    if (response.status === 401) {
      console.log("Token expired, refreshing...");
      const refreshed = await refreshToken();

      if (refreshed) {
        token = await getValidToken();

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const retryConfig: RequestInit = {
          method,
          headers,
        };

        if (body) {
          retryConfig.body = isFormData ? body : JSON.stringify(body);
        }

        const retryResponse = await fetch(url, retryConfig);

        if (retryResponse.ok) {
          return await retryResponse.json();
        }
      }

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.reload();
      return;
    }

    if (!response.ok) {
      throw await response.json();
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

export function fetchGet(url: string) {
  return fetchWithAuth(url);
}

export function fetchPost(
  url: string,
  body: Record<string, unknown> | FormData
) {
  return fetchWithAuth(url, "POST", body);
}

export function fetchPut(
  url: string,
  body: Record<string, unknown> | FormData
) {
  return fetchWithAuth(url, "PUT", body);
}

export function fetchPatch(
  url: string,
  body: Record<string, unknown> | FormData
) {
  return fetchWithAuth(url, "PATCH", body);
}

export function fetchDelete(url: string) {
  return fetchWithAuth(url, "DELETE");
}
