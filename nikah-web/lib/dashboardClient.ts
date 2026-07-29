export type ApiError = {
  code?: string;
  message?: string;
};

export type ApiEnvelope<T> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, unknown>;
};

export const dashboardRequest = async <T>(
  url: string,
  init?: RequestInit,
): Promise<ApiEnvelope<T>> => {
  try {
    const response = await fetch(url, {
      ...init,
      headers: init?.body
        ? { "Content-Type": "application/json", ...init.headers }
        : init?.headers,
    });
    const body: unknown = await response.json();
    if (typeof body === "object" && body !== null && "success" in body) {
      return body as ApiEnvelope<T>;
    }
    return {
      success: false,
      error: { code: "INVALID_RESPONSE", message: "Respons server tidak terbaca." },
    };
  } catch (error) {
    console.error("Dashboard request failed:", error);
    return {
      success: false,
      error: { code: "NETWORK_ERROR", message: "Jaringannya sedang tersendat. Coba lagi." },
    };
  }
};
