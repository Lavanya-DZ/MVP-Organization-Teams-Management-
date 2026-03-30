import { AUTH_API_BASE_URL, CORE_API_BASE_URL } from "../utils/constants";
import {
  getOrganizationsCached,
  getTeamsCached,
  invalidateAllTeamCacheForToken,
  invalidateOrganizationsCache,
  invalidateTeamCache,
  resetApiCache,
} from "./apiCache";
import {
  authorizedFetch,
  authorizedRequest,
  extractBearerToken,
  parseResponse,
  publicPostJson,
  resolveTokenForCache,
} from "./httpClient";

export { resetApiCache };

export const signupUser = (payload) =>
  publicPostJson(`${AUTH_API_BASE_URL}/users`, payload).then(parseResponse);

export const loginUser = (payload) =>
  publicPostJson(`${AUTH_API_BASE_URL}/token`, payload).then(async (res) => {
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

    const authorizationHeader =
      res.headers.get("authorization") || res.headers.get("Authorization");
    const headerAccessToken = extractBearerToken(authorizationHeader);
    const bodyAccessToken =
      typeof data === "object"
        ? (
          data?.access_token ||
          data?.accessToken ||
          extractBearerToken(data?.token) ||
          ""
        )
        : "";
    const bodyRefreshToken =
      typeof data === "object"
        ? data?.refresh_token || data?.refreshToken || ""
        : "";

    return {
      ...(typeof data === "object" ? data : {}),
      access_token: bodyAccessToken || headerAccessToken,
      refresh_token: bodyRefreshToken,
      token_type:
        (typeof data === "object" && data?.token_type) ||
        (bodyAccessToken || headerAccessToken ? "bearer" : ""),
    };
  });

export const listOrganizations = (token, { forceRefresh = false } = {}) =>
  getOrganizationsCached({
    tokenKey: resolveTokenForCache(token),
    forceRefresh,
    fetcher: () => authorizedFetch(`${CORE_API_BASE_URL}/organizations`, token),
  });

export const createOrganization = (payload, token) =>
  authorizedRequest(`${CORE_API_BASE_URL}/organizations`, {
    method: "POST",
    token,
    body: payload,
  }).then((createdOrganization) => {
    const tokenKey = resolveTokenForCache(token);
    invalidateOrganizationsCache(tokenKey);
    invalidateAllTeamCacheForToken(tokenKey);
    return createdOrganization;
  });

export const deleteOrganizationById = (organizationId, token) =>
  authorizedRequest(`${CORE_API_BASE_URL}/organizations/${organizationId}`, {
    method: "DELETE",
    token,
  }).then((deletedOrganization) => {
    const tokenKey = resolveTokenForCache(token);
    invalidateOrganizationsCache(tokenKey);
    invalidateAllTeamCacheForToken(tokenKey);
    return deletedOrganization;
  });

export const getUserById = (userId, token) =>
  authorizedFetch(`${AUTH_API_BASE_URL}/users/${userId}`, token);

export const listTeamsByOrganization = (
  organizationId,
  token,
  { forceRefresh = false } = {}
) =>
  getTeamsCached({
    tokenKey: resolveTokenForCache(token),
    organizationId,
    forceRefresh,
    fetcher: () =>
      authorizedFetch(
        `${CORE_API_BASE_URL}/organization/${organizationId}/teams`,
        token
      ),
  });

export const createTeamByOrganization = (organizationId, payload, token) =>
  authorizedRequest(`${CORE_API_BASE_URL}/organization/${organizationId}/teams`, {
    method: "POST",
    token,
    body: payload,
  }).then((createdTeam) => {
    const tokenKey = resolveTokenForCache(token);
    invalidateTeamCache(tokenKey, organizationId);
    invalidateOrganizationsCache(tokenKey);
    return createdTeam;
  });

export const deleteTeamById = (teamId, organizationId, token) =>
  authorizedRequest(`${CORE_API_BASE_URL}/teams/${teamId}`, {
    method: "DELETE",
    token,
  }).then((deletedTeam) => {
    const tokenKey = resolveTokenForCache(token);
    invalidateTeamCache(tokenKey, organizationId);
    invalidateOrganizationsCache(tokenKey);
    return deletedTeam;
  });

export const listMembersByTeam = (teamId, token) =>
  authorizedFetch(`${CORE_API_BASE_URL}/teams/${teamId}/members`, token);

export const createMemberByTeam = (teamId, payload, token) =>
  authorizedRequest(`${CORE_API_BASE_URL}/teams/${teamId}/members`, {
    method: "POST",
    token,
    body: payload,
  });