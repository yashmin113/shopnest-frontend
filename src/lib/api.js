const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const extractMessage = (data, fallback) =>
  data?.details?.[0]?.message || data?.message || fallback;

export const apiFetch = async (
  path,
  { method = "GET", body, token, headers = {}, signal } = {}
) => {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const requestHeaders = { ...headers };
  let payload = body;

  if (body !== undefined && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: payload,
    signal,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(
      extractMessage(data, `Request failed with status ${response.status}`),
      response.status,
      data?.details
    );
  }

  return data;
};

export default apiFetch;
