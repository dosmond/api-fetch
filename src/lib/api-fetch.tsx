import React, { createContext, useContext, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

interface Endpoints {
  'v1/auth/signup': { request: { username: string; password: string }; response: { token: string } }
}

// Create the context
type ApiContextType<T> = {
  useFetch: <K extends keyof T>(
    endpoint: K extends keyof T ? K : never,
    options?: { params?: T[K] extends { request: any } ? T[K]['request'] : never }
  ) => ReturnType<typeof useQuery<T[K] extends { response: any } ? T[K]['response'] : never>>;
};

const ApiContext = createContext<ApiContextType<any> | null>(null);

// Create the provider component
export function ApiProvider<T>({
  children,
  baseUrl,
}: {
  children: ReactNode;
  baseUrl: string;
}) {
  const queryClient = new QueryClient();

  function useFetch<K extends keyof T>(
    endpoint: K extends keyof T ? K : never,
    options?: { params?: T[K] extends { request: any } ? T[K]['request'] : never }
  ) {
    return useQuery<T[K] extends { response: any } ? T[K]['response'] : never>({
      queryKey: [endpoint, options?.params],
      queryFn: async () => {
        const { data } = await axios.get(`${baseUrl}${endpoint as string}`, { params: options?.params });
        return data;
      }
    });
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={{ useFetch: useFetch as ApiContextType<T>['useFetch'] }}>
        {children}  
      </ApiContext.Provider>
    </QueryClientProvider>
  );
}

// Create a custom hook to use the context
export function useApi<T>() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context as ApiContextType<T>;
}

const { useFetch } = useApi<Endpoints>();

const SignupSchema = z.object({
  username: z.string(),
  password: z.string()
}).strict();

const signupData = SignupSchema.parse({ username: "test", password: "test" });

useFetch("v1/auth/signup", { params: signupData})