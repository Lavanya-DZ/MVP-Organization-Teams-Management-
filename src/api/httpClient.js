const USER_STORAGE_KEY = "user";

const getStoredAccessToken = () => {
  try {
    const sessionUser = sessionStorage.getItem(USER_STORAGE_KEY);
    if (sessionUser) {
      const parsedSessionUser = JSON.parse(sessionUser);
      return parsedSessionUser?.accessToken || "";
    }

    // Legacy fallback for old localStorage sessions.
    const legacyLocalUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!legacyLocalUser) {
      return "";
    }

    const parsedUser = JSON.parse(legacyLocalUser);
    return parsedUser?.accessToken || "";
  } catch (error) {
    sessionStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    return "";
  }
};

export const parseResponse = async (res) => {
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : await res.text();

  if (!res.ok) {
    const detail = typeof data === "object" && data?.detail
      ? data.detail
      : "Request failed";
    throw new Error(typeof detail === "string" ? detail : "Request failed");
  }

  return data;
};

export const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    return "";
  }

  const trimmedHeader = authorizationHeader.trim();
  const [scheme, token] = trimmedHeader.split(" ");

  if (/^Bearer$/i.test(scheme) && token) {
    return token.trim();
  }

  return trimmedHeader;
};

export const resolveTokenForCache = (token) => token || getStoredAccessToken() || "";

const authHeaders = (token) => {
  const resolvedToken = resolveTokenForCache(token);

  if (!resolvedToken) {
    throw new Error("Authentication required. Please login again.");
  }

  return {
    Authorization: `Bearer ${resolvedToken}`,
    "Content-Type": "application/json",
  };
};

export const authorizedRequest = (url, { method = "GET", token, body } = {}) =>
  fetch(url, {
    method,
    headers: authHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  }).then(parseResponse);

export const authorizedFetch = (url, token) =>
  authorizedRequest(url, { method: "GET", token });

export const publicPostJson = (url, payload) =>
  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });