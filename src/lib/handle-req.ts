import {
  FetchEndpoint,
  FetchRequestMap,
  FetchResponseMap,
  MutateEndpoint,
  MutateRequestMap,
  MutateResponseMap,
  RouteParams,
} from "./api-fetch";

import axios, { AxiosError } from "axios";

export const handleReq = async <T extends FetchEndpoint>({
  baseUrl,
  path,
  variables,
  routeParams,
}: {
  baseUrl: string;
  path: T;
  variables?: FetchRequestMap<T>;
  routeParams?: RouteParams;
}): Promise<FetchResponseMap<T>> => {
  let parsedPath = path as string;

  if (Object.keys(routeParams || {}).length > 0) {
    Object.entries(routeParams || {}).forEach(([key, value]) => {
      parsedPath = parsedPath.replace(`:${key}`, value.toString());
    });
  }

  try {
    const resp = await axios<FetchResponseMap<T>>(`${baseUrl}${parsedPath}`, {
      params: { ...(variables || {}) },
      withCredentials: true,
      method: "GET",
    });

    return resp?.data;
  } catch (e: AxiosError | unknown) {
    if (e instanceof AxiosError && e.response?.status === 401) {
      document.dispatchEvent(new CustomEvent("unauthorized"));
    }

    if (e instanceof AxiosError) {
      return e.response?.data;
    }

    throw e;
  }
};

export const handleMutate = async <T extends MutateEndpoint>({
  baseUrl,
  path,
  body,
  method,
  routeParams,
}: {
  baseUrl: string;
  path: T;
  body?: MutateRequestMap<T>;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  routeParams?: RouteParams;
}): Promise<MutateResponseMap<T>> => {
  let parsedPath = path as string;

  if (Object.keys(routeParams || {}).length > 0) {
    Object.entries(routeParams || {}).forEach(([key, value]) => {
      parsedPath = parsedPath.replace(`:${key}`, value.toString());
    });
  }

  try {
    const resp = await axios<MutateResponseMap<T>>(`${baseUrl}${path}`, {
      data: { ...(body || {}) },
      withCredentials: true,
      method,
    });

    return resp?.data;
  } catch (e: AxiosError | unknown) {
    if (e instanceof AxiosError && e.response?.status === 401) {
      document.dispatchEvent(new CustomEvent("unauthorized"));
    }

    if (e instanceof AxiosError) {
      return e.response?.data;
    }

    throw e;
  }
};
