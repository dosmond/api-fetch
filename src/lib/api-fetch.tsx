import {
  QueryClient,
  QueryClientProvider,
  QueryKey,
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { request } from "http";
import React, { createContext, ReactNode, useContext } from "react";

export type ApiDefinition<T, R> = {
  request: T;
  response: R;
};

// Create the context
type ApiContextType<TFetch = {}, TMutate = {}> = {
  baseUrl: string;
  queryClient: QueryClient;
  fetchEndpoints: TFetch;
  mutateEndpoints?: TMutate;
  useFetch: <K extends keyof TFetch>(
    endpoint: K,
    data: TFetch[K] extends { request: any } ? TFetch[K]["request"] : never,
    options?: {
      params?: TFetch[K] extends { request: any }
        ? TFetch[K]["request"]
        : never;
    },
    queryOptions?: Omit<
    UseQueryOptions<
      TFetch[K] extends { response: any } ? TFetch[K]["response"] : never
    >,
    "queryFn" | "queryKey"
  >
  ) => ReturnType<
    typeof useQuery<
      TFetch[K] extends { response: any } ? TFetch[K]["response"] : never
    >
  >;
  useDo: <K extends keyof TMutate>(
    endpoint: K,
    body: TMutate[K] extends { request: any } ? TMutate[K]["request"] : never,
    requestOptions?: Omit<AxiosRequestConfig, "data"> & {
      body?: TMutate[K] extends { request: any }
        ? TMutate[K]["request"]
        : never;
    },
    mutationOptions?: Omit<UseMutationOptions, "mutationFn">
  ) => ReturnType<
    typeof useMutation<
      TMutate[K] extends { response: any } ? TMutate[K]["response"] : never
    >
  >;
};

const ApiContext = createContext<ApiContextType<any, any> | null>(null);

// Create the provider component
export function ApiProvider<TFetch extends Record<string, ApiDefinition<any, any>>, TMutate extends Record<string, ApiDefinition<any, any>>>({
  children,
  baseUrl,
  queryClient,
  fetchEndpoints,
  mutateEndpoints,
  onError,
}: {
  children: ReactNode;
  baseUrl: string;
  queryClient: QueryClient;
  fetchEndpoints: TFetch;
  mutateEndpoints?: TMutate;
  onError?: (error: AxiosError | Error) => void;
}) {

  function useFetch<K extends keyof TFetch>(
    endpoint: K,
    data: TFetch[K] extends { request: any } ? TFetch[K]["request"] : never,
    requestOptions?: Omit<AxiosRequestConfig, "params" | "method"> & {
      params?: TFetch[K] extends { request: any }
        ? TFetch[K]["request"]
        : never;
    },
    queryOptions?: Omit<
    UseQueryOptions<
      TFetch[K] extends { response: any } ? TFetch[K]["response"] : never
    >,
    "queryFn" | "queryKey"
  >
  ) {
    return useQuery<
      TFetch[K] extends { response: any } ? TFetch[K]["response"] : never
    >({
      queryKey: [endpoint, requestOptions?.params],
      queryFn: async () => {
        try {
          const { data: responseData } = await axios(
            `${baseUrl}${endpoint as string}`,
            { params: data ?? {}}
          );
          return responseData;
        } catch(err) {
          onError?.(err as AxiosError | Error);

          if(onError) {
            return err.response?.data;
          }
          throw err;
        }
      },
      ...queryOptions,
    });
  }

  function useDo<K extends keyof TMutate>(
    endpoint: K extends keyof TMutate ? K : never,
    body: TMutate[K] extends { request: any } ? TMutate[K]["request"] : never,
    requestOptions?: Omit<AxiosRequestConfig, "data"> & {
      body?: TMutate[K] extends { request: any }
        ? TMutate[K]["request"]
        : never;
    },
    mutationOptions?: Omit<UseMutationOptions, "mutationFn">
  ) {
    return useMutation<
      TMutate[K] extends { response: any } ? TMutate[K]["response"] : never
    >({
      mutationFn: async () => {
        try {
          const { data } = await axios(
            `${baseUrl}${endpoint as string}`,
          {
            data: body,
            method: "POST",
            ...requestOptions,
          }
        );
        return data;
        } catch(err) {
          onError?.(err as AxiosError | Error);

          if(onError) {
            return err.response?.data;
          }
          throw err;
        }
      },
      ...mutationOptions,
    });
  }

  const contextValue: ApiContextType<TFetch, TMutate> = {
    baseUrl,
    queryClient,
    fetchEndpoints,
    mutateEndpoints,
    useFetch: useFetch as ApiContextType<TFetch, TMutate>["useFetch"],
    useDo: useDo as ApiContextType<TFetch, TMutate>["useDo"],
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={contextValue}>{children}</ApiContext.Provider>
    </QueryClientProvider>
  );
}

function useApi<TFetch = {}, TMutate = {}>() {
  const context = useContext(ApiContext)

  if (!context) {
    throw new Error("useGetValue must be used within an ApiProvider");
  }

  return context as ApiContextType<TFetch, TMutate>; 
}


export function useFetch<TFetch>(
  endpoint: keyof TFetch,
  data: TFetch[keyof TFetch] extends { request: any } ? TFetch[keyof TFetch]["request"] : never,
  requestOptions?: Omit<AxiosRequestConfig, "params" | "method"> & {
    params?: TFetch[keyof TFetch] extends { request: any }
      ? TFetch[keyof TFetch]["request"]
      : never;
  },
  queryOptions?: Omit<
    UseQueryOptions<
      TFetch[keyof TFetch] extends { response: any } ? TFetch[keyof TFetch]["response"] : never,
      Error,
      TFetch[keyof TFetch] extends { response: any } ? TFetch[keyof TFetch]["response"] : never,
      QueryKey
    >,
    "queryFn" | "queryKey"
  >
) {
  const { useFetch } = useApi<TFetch>();

  return useFetch(endpoint, data, requestOptions, queryOptions);
}

export function useDo<TMutate>(
  endpoint: keyof TMutate,
  data: TMutate[keyof TMutate] extends { request: any } ? TMutate[keyof TMutate]["request"] : never,
  requestOptions?: {
    body?: TMutate[keyof TMutate] extends { request: any } ? TMutate[keyof TMutate]["request"] : never;
  },
  mutationOptions?: Omit<UseMutationOptions, "mutationFn">
) {
  const { useDo } = useApi<{}, TMutate>();

  return useDo(endpoint, data, requestOptions, mutationOptions);
}