import {
  ApiDefinition,
  FetchRequestMap,
  MutateRequestMap,
} from "../lib/api-fetch";
import { Account, AccountOnboardingRequest } from "../dto/account.dto";
import { AppResponse } from "../dto/base.dto";
import { handleMutate, handleReq } from "../lib/handle-req";

/*

  QUERIES 

*/
const AccountInformationQuery = "/v1/account" as const;

export interface AccountFetch {
  [AccountInformationQuery]: ApiDefinition<void, Account>;
}

export const accountFetch = {
  [AccountInformationQuery]: async (
    baseUrl: string,
    req: FetchRequestMap<typeof AccountInformationQuery>
  ) => {
    const resp = await handleReq({
      baseUrl,
      path: AccountInformationQuery,
      variables: req,
    });
    return resp;
  },
};

const AccountOnboardingCompleteMutate = "/v1/account/onboard" as const;

export interface AccountMutate {
  [AccountOnboardingCompleteMutate]: ApiDefinition<
    AccountOnboardingRequest,
    AppResponse<string>
  >;
}

export const accountMutate = {
  [AccountOnboardingCompleteMutate]: async (
    baseUrl: string,
    req: MutateRequestMap<typeof AccountOnboardingCompleteMutate>
  ) => {
    const resp = await handleMutate({
      baseUrl,
      path: AccountOnboardingCompleteMutate,
      body: req,
      method: "POST",
    });
    return resp;
  },
};
