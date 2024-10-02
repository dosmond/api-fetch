export type AccountSetting = {
  id: number;
  accountId: string;
  typeId: number;
  value: string;
  sequence: number;
  expireDate: Date;
  createDate: Date;
};

export type Account = {
  accountId: string;
  statusId: number;
  businessName: string;
  sourceUniqueId: string;
  sourceTypeId: number;
  domain: string;
  websiteUrl: string;
  createDate: Date;

  settings?: AccountSetting[];
};

export type AccountOnboardingRequest = {
  businessName: string;
  websiteUrl: string;
  businessSize: number;
};
