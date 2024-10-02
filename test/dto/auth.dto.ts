export interface AuthLoginRequestDTO {
  email: string;
  password: string;
}

export interface ApiSession {
  id: string;
  accessToken: string;
  sessionUserId: string;
  accessToAccountId: string;
  expireDate: Date;
}

export interface AuthSignupRequestDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthUserEmailVerificationRequestDTO {
  token: string;
}

export interface AuthPasswordRecoveryRequestDTO {
  email: string;
}

export interface AuthPasswordResetRequestDTO {
  token: string;
  password: string;
}
