async function fetchWithAuth(
  url: string,
  method: string = "GET",
  body: Record<string, unknown> | FormData | null = null
) {
  const isFormData = body instanceof FormData;
  const token = localStorage.getItem("accessToken");
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

  if (!response.ok) {
    throw await response.json();
  }

  return await response.json();
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
