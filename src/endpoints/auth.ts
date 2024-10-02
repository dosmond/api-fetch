import { ApiDefinition, FetchRequestMap, MutateRequestMap } from "../api-fetch";
import {
  ApiSession,
  AuthLoginRequestDTO,
  AuthPasswordRecoveryRequestDTO,
  AuthPasswordResetRequestDTO,
  AuthSignupRequestDTO,
  AuthUserEmailVerificationRequestDTO,
} from "../dto/auth.dto";
import { AppResponse } from "../dto/base.dto";
import { handleMutate, handleReq } from "../handle-req";
import { FetchResponseMap } from "../lib/api-fetch";

/*

  QUERIES 

*/

const PasswordRecoveryQuery = "/v1/auth/password/recovery" as const;
const AuthMeQuery = "/v1/auth/me" as const;

export interface AuthFetch {
  [AuthMeQuery]: ApiDefinition<void, AppResponse<ApiSession>>;
  [PasswordRecoveryQuery]: ApiDefinition<
    AuthPasswordRecoveryRequestDTO,
    AppResponse
  >;
}

export const authFetch = {
  [AuthMeQuery]: async (
    baseUrl: string,
    req: FetchRequestMap<typeof AuthMeQuery>
  ): Promise<FetchResponseMap<typeof AuthMeQuery>> => {
    const resp = await handleReq({
      baseUrl,
      path: AuthMeQuery,
      variables: req,
    });
    return resp;
  },
  [PasswordRecoveryQuery]: async (
    baseUrl: string,
    req: FetchRequestMap<typeof PasswordRecoveryQuery>
  ): Promise<FetchResponseMap<typeof PasswordRecoveryQuery>> => {
    const resp = await handleReq({
      baseUrl,
      path: PasswordRecoveryQuery,
      variables: req,
    });
    return resp;
  },
};

/*

  MUTATIONS

*/

const AuthLoginMutation = "/v1/auth" as const;
const AuthLogoutMutation = "/v1/auth/logout" as const;
const AuthSignupMutation = "/v1/auth/signup" as const;
const AuthUserEmailVerificationMutation = "/v1/auth/verify" as const;
const AuthPasswordResetMutation = "/v1/auth/password/reset" as const;

export interface AuthMutate {
  [AuthLoginMutation]: ApiDefinition<AuthLoginRequestDTO, AppResponse>;
  "/v1/auth/logout": ApiDefinition<void, AppResponse>;
  "/v1/auth/signup": ApiDefinition<AuthSignupRequestDTO, AppResponse>;
  "/v1/auth/verify": ApiDefinition<
    AuthUserEmailVerificationRequestDTO,
    AppResponse
  >;
  "/v1/auth/password/reset": ApiDefinition<
    AuthPasswordResetRequestDTO,
    AppResponse
  >;
}

export const authMutate = {
  [AuthLoginMutation]: async (
    baseUrl: string,
    req: MutateRequestMap<typeof AuthLoginMutation>
  ) => {
    const resp = await handleMutate({
      baseUrl,
      path: AuthLoginMutation,
      body: req,
      method: "POST",
    });
    return resp;
  },
  [AuthLogoutMutation]: async (
    baseUrl: string,
    req: MutateRequestMap<typeof AuthLogoutMutation>
  ) => {
    const resp = await handleMutate({
      baseUrl,
      path: AuthLogoutMutation,
      body: req,
      method: "POST",
    });
    return resp;
  },
  [AuthSignupMutation]: async (
    baseUrl: string,
    req: MutateRequestMap<typeof AuthSignupMutation>
  ) => {
    const resp = await handleMutate({
      baseUrl,
      path: AuthSignupMutation,
      body: req,
      method: "POST",
    });
    return resp;
  },
  [AuthUserEmailVerificationMutation]: async (
    baseUrl: string,
    req: MutateRequestMap<typeof AuthUserEmailVerificationMutation>
  ) => {
    const resp = await handleMutate({
      baseUrl,
      path: AuthUserEmailVerificationMutation,
      body: req,
      method: "POST",
    });
    return resp;
  },
  [AuthPasswordResetMutation]: async (
    baseUrl: string,
    req: MutateRequestMap<typeof AuthPasswordResetMutation>
  ) => {
    const resp = await handleMutate({
      baseUrl,
      path: AuthPasswordResetMutation,
      body: req,
      method: "POST",
    });
    return resp;
  },
};
