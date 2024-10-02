import { createContext, useContext } from "react";
import {
  MutationObserverOptions,
  QueryClient,
  UndefinedInitialDataOptions,
  useMutation,
  UseMutationResult,
  useQuery,
  UseQueryResult,
} from "@tanstack/react-query";
import {
  authFetch,
  AuthFetch,
  authMutate,
  AuthMutate,
} from "../endpoints/auth";
import {
  accountFetch,
  AccountFetch,
  accountMutate,
  AccountMutate,
} from "../endpoints/account";

export type DateString = string;

declare global {
  interface Window {
    queryClient: QueryClient;
  }
}

export const OPERATORS = ["ne", "eq", "lt", "gt", "in"] as const;
type OperatorTuple = typeof OPERATORS;
export type OperatorValue = OperatorTuple[number];

export type RouteParams = Record<string, string | number | symbol> | null;

export type ApiDefinition<RequestType = void, ResponseType = void> = [
  RequestType,
  ResponseType
];

export type FetchMap = AuthFetch & AccountFetch;
export type FetchEndpoint = keyof FetchMap;
export type FetchRequestMap<T extends keyof FetchMap> = FetchMap[T][0];
export type FetchResponseMap<T extends keyof FetchMap> = FetchMap[T][1];
export type FetchApiCollection<T extends FetchEndpoint> = Record<
  T,
  (
    baseUrl: string,
    req: FetchRequestMap<T>,
    routeParams?: RouteParams
  ) => Promise<FetchResponseMap<T>>
>;

export type AuthFetchType = {
  [K in keyof AuthFetch]: (
    baseUrl: string,
    req: FetchRequestMap<K>,
    routeParams?: RouteParams
  ) => Promise<FetchResponseMap<K>>;
};

export const fetchApis: FetchApiCollection<any> = {
  ...authFetch,
  ...accountFetch,
};

export type MutateMap = AuthMutate & AccountMutate;
export type MutateEndpoint = keyof MutateMap;
export type MutateRequestMap<T extends keyof MutateMap> = MutateMap[T][0];
export type MutateResponseMap<T extends keyof MutateMap> = MutateMap[T][1];
export type MutateApiCollection<T extends MutateEndpoint> = Record<
  T,
  (
    baseUrl: string,
    req: MutateRequestMap<T>,
    routeParams?: RouteParams
  ) => Promise<MutateResponseMap<T>>
>;

export type Responser<T extends RequestEndpoint> = FetchResponseMap<T>;

export const mutateApis: MutateApiCollection<any> = {
  ...authMutate,
  ...accountMutate,
};

export type RequestEndpoint = FetchEndpoint;

type FetchOptions<T extends RequestEndpoint> = {
  params?: FetchRequestMap<T>;
  queryOptions?: Omit<
    UndefinedInitialDataOptions<FetchResponseMap<T>>,
    "queryKey" | "queryFn"
  >;
  extraKey?: string | number | null;
  routeParams?: RouteParams;
};

export const $apiUse = <T extends RequestEndpoint>(
  key: T,
  options?: FetchOptions<T>
): UseQueryResult<Responser<T>> => {
  const {
    params = {},
    queryOptions = {},
    extraKey = null,
    routeParams = null,
  } = options || {};

  const { baseUrl } = useContext(ApiContext);

  return useQuery({
    queryKey: [key, JSON.stringify(params), extraKey?.toString()].filter(
      Boolean
    ),
    queryFn: async () => {
      const resp = await fetchApis[key]?.(baseUrl, { ...params }, routeParams);
      return resp;
    },
    ...queryOptions,
  });
};

type MutateOptions<T extends MutateEndpoint> = {
  body?: MutateRequestMap<T>;
  mutateOptions?: MutationObserverOptions<
    MutateResponseMap<T>,
    unknown,
    Partial<MutateRequestMap<T>>,
    unknown
  >;
  routeParams?: RouteParams;
};

export const $apiDo = <T extends MutateEndpoint>(
  key: T,
  options?: MutateOptions<T>
): UseMutationResult<
  MutateResponseMap<T>,
  unknown,
  Partial<MutateRequestMap<T>>,
  unknown
> => {
  const { mutateOptions = {}, routeParams = null } = options || {};

  const { baseUrl } = useContext(ApiContext);

  return useMutation({
    mutationFn: async (body: Partial<MutateRequestMap<T>>) => {
      const result = await mutateApis[key]?.(
        baseUrl,
        {
          ...body,
        },
        routeParams
      );
      if (result === undefined) {
        throw new Error("API function returned undefined");
      }
      return result;
    },
    ...mutateOptions,
  });
};

const ApiContext = createContext<{
  baseUrl: string;
}>({
  baseUrl: "",
});

export const ApiProvider = ({
  baseUrl,
  children,
}: {
  baseUrl: string;
  children: React.ReactNode;
}) => {
  return (
    <ApiContext.Provider
      value={{
        baseUrl,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
