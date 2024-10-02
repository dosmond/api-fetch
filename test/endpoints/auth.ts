import type { ApiDefinition } from "../../src/lib/api-fetch";

type SignupRequest = { username: string; password: string };
type SignupResponse = { token: string };

const fetchEndpoints = {
  "v1/auth/signup": {} as ApiDefinition<SignupRequest, SignupResponse>,
  "v1/auth/login": {} as ApiDefinition<
    { username: string; password: string },
    { token: string }
  >
} as const;

type FetchEndpoints = typeof fetchEndpoints;

export { fetchEndpoints, FetchEndpoints };